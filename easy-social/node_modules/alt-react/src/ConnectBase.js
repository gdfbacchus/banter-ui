import React from 'react'
import PropTypes from "prop-types";

export default class Connect extends React.Component {
  static contextTypes = {
    flux: PropTypes.object,
  }

  setConnections(props, context, config = {}) {
    this.flux = props.flux || context.flux
    this.stores = this.flux ? this.flux.stores : {}
    this.config = typeof config === 'function'
      ? config(this.stores, this.flux)
      : config

    this.cb = () => {
        this.forceUpdate()
    }
  }

  componentWillMount() {
    if (this.config.willMount) this.call(this.config.willMount)
  }

  componentDidMount() {
    const stores = this.config.listenTo ? this.call(this.config.listenTo) : []
    stores.forEach((store) => {
      store.listen(this.cb)
    })

    if (this.config.didMount) this.call(this.config.didMount)
  }

  componentWillUnmount() {
    const stores = this.config.listenTo ? this.call(this.config.listenTo) : []
    stores.forEach(store => store.unlisten(this.cb))
    if (this.config.willUnmount) this.call(this.config.willUnmount)
  }

  componentWillReceiveProps(nextProps) {
    if (this.config.willReceiveProps) this.call(this.config.willReceiveProps)
  }

  shouldComponentUpdate(nextProps) {
    return this.config.shouldComponentUpdate
      ? this.call(this.config.shouldComponentUpdate, nextProps)
      : true
  }

  getNextProps(nextProps = this.props) {
    return this.config.getProps
      ? this.call(this.config.getProps, nextProps)
      : nextProps
  }

  call(f, props = this.props) {
    return f(props, this.context, this.flux)
  }

  render() {
    throw new Error('Render should be defined in your own class')
  }
}

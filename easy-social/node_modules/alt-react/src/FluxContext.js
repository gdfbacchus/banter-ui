import React from 'react'
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

export default createReactClass({
  childContextTypes: {
    flux: PropTypes.object,
  },

  getChildContext() {
    return { flux: this.props.flux }
  },

  render() {
    return this.props.children
  }
})

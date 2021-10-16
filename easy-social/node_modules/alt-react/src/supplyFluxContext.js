import React from 'react'
import PropTypes from "prop-types";
import createReactClass from "create-react-class";

export default flux => Component => createReactClass({
  childContextTypes: {
    flux: PropTypes.object,
  },

  getChildContext() {
    return { flux }
  },

  render() {
    return <Component {...this.props} />
  },
})

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require("create-react-class");

var _createReactClass2 = _interopRequireDefault(_createReactClass);

exports["default"] = (0, _createReactClass2["default"])({
  childContextTypes: {
    flux: _propTypes2["default"].object
  },

  getChildContext: function getChildContext() {
    return { flux: this.props.flux };
  },

  render: function render() {
    return this.props.children;
  }
});
module.exports = exports["default"];
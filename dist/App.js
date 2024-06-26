"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _codeiff = _interopRequireDefault(require("./codeiff"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const App = () => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "App"
  }, /*#__PURE__*/_react.default.createElement("h1", null, "Code Difference Viewer"), /*#__PURE__*/_react.default.createElement(_codeiff.default, null));
};
var _default = exports.default = App;
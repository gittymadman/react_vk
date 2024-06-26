"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInput = exports.useImmer = void 0;
var _react = require("react");
var _immer = require("immer");
const useInput = initialValue => {
  const [value, onChange] = (0, _react.useState)(initialValue);
  return {
    value,
    onChange(e) {
      onChange(e.target.value);
    }
  };
};
exports.useInput = useInput;
const useImmer = (producer, initialValue) => (0, _react.useReducer)((state, action) => (0, _immer.produce)(state, draft => producer(draft, action)), initialValue);
exports.useImmer = useImmer;
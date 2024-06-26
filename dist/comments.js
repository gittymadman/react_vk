"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useConversations = exports.Conversation = void 0;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _hooks = require("./hooks");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useConversations = () => {
  const [conversations, dispatch] = (0, _hooks.useImmer)((state, action) => {
    switch (action.type) {
      case 'INIT':
        state[action.payload.key] = {
          comments: []
        };
        break;
      case 'COMMENT':
        {
          const {
            key,
            content
          } = action.payload;
          const conversation = state[key];
          conversation.comments.push(content);
          break;
        }
      default:
        break;
    }
  }, {});
  const initConversation = (0, _react.useCallback)(key => dispatch({
    type: 'INIT',
    payload: {
      key
    }
  }), [dispatch]);
  const addComment = (0, _react.useCallback)((key, content) => dispatch({
    type: 'COMMENT',
    payload: {
      key,
      content
    }
  }), [dispatch]);
  return [conversations, {
    initConversation,
    addComment
  }];
};
exports.useConversations = useConversations;
const Comment = _ref => {
  let {
    content
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "comment"
  }, content);
};
const Editor = _ref2 => {
  let {
    onSubmit
  } = _ref2;
  const [value, setValue] = (0, _react.useState)('');
  const updateValue = (0, _react.useCallback)(e => setValue(e.target.value), []);
  const submitDraft = (0, _react.useCallback)(() => {
    onSubmit(value);
    setValue('');
  }, [value, onSubmit]);
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "editor"
  }, /*#__PURE__*/_react.default.createElement(_antd.Input.TextArea, {
    rows: 4,
    value: value,
    onChange: updateValue
  }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "submit",
    type: "primary",
    onClick: submitDraft
  }, "Add Comment"));
};
const Conversation = _ref3 => {
  let {
    changeKey,
    comments,
    onSubmitComment
  } = _ref3;
  const submitComment = (0, _react.useCallback)(content => onSubmitComment(changeKey, content), [changeKey, onSubmitComment]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "conversation"
  }, comments.map((comment, i) => /*#__PURE__*/_react.default.createElement(Comment, {
    key: i,
    content: comment
  })), /*#__PURE__*/_react.default.createElement(Editor, {
    onSubmit: submitComment
  }));
};
exports.Conversation = Conversation;
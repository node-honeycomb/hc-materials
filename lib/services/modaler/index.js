"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
  }
  return t;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = require("react");

var react_dom_1 = require("react-dom");

var prop_types_1 = require("prop-types");

var modal_1 = require("antd/lib/modal");

var Modaler =
/** @class */
function () {
  function Modaler(context) {
    var _this = this;

    this._mdoals = [];
    ['info', 'success', 'error', 'warning', 'confirm'].forEach(function (action) {
      _this[action] = function (dialogProps) {
        if (!dialogProps.getContainer) {
          dialogProps.getContainer = function () {
            return context.app.storeContainer;
          };
        }

        var closeModal = modal_1["default"][action](dialogProps);

        _this._modals.push({
          destroy: closeModal
        });

        return _this._modals[_this._modals.length - 1];
      };
    });
  }

  Modaler.prototype.open = function (_a) {
    var _this = this;

    var content = _a.content,
        dialogProps = __rest(_a, ["content"]);

    var Dialog = function Dialog() {
      var _a = react_1.useState({
        visible: true,
        getContainer: function getContainer() {
          return _this.context.app.storeContainer;
        }
      }),
          state = _a[0],
          setState = _a[1];

      _this._modals.push({
        destroy: function destroy() {
          return setState({
            visible: false
          });
        }
      });

      return React.createElement(modal_1["default"], _extends({}, dialogProps, state), content);
    };

    react_dom_1["default"].render(React.createElement(Dialog, null), document.body);
    return this._modals[this._modals.length - 1];
  };

  Modaler.prototype.clear = function () {
    var modal = this._modals.pop();

    while (modal) {
      modal.destroy();
      modal = this._modals.pop();
    }
  };

  Modaler.prototype.destroy = function () {
    this.clear();
  };

  Modaler.propTypes = {
    app: prop_types_1["default"].object.isRequired
  };
  return Modaler;
}();

exports.Modaler = Modaler;
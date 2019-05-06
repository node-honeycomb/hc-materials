"use strict";

var _path = _interopRequireDefault(require("path"));

var _galleryResolver = require("./layers/galleryResolver");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var context = require.context('./', true, /^((?!style).)+\/\w+\.jsx?$/);

var exportObj = {};
var gallery = {
  layers: {},
  layouts: {},
  services: {},
  components: {}
};
context.keys().forEach(function (key) {
  var ks = key.split('/');
  var filename = ks.pop();
  var len = ks.length;
  var dirname = ks[len - 2];

  if (gallery[dirname] && _path["default"].basename(filename, _path["default"].extname(filename)) === 'index') {
    _extends(gallery[dirname], context(key));
  }

  _extends(exportObj, context(key));
});
var components = gallery.components;
gallery.components = {
  hc: components
};
(0, _galleryResolver.setGallery)(gallery);
module.exports = exportObj;
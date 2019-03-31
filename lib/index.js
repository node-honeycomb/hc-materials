"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var path_1 = require("path");

var galleryResolver_1 = require("./layers/galleryResolver");

var context = require.context('./', true, /\w+\/\w+\.(jsx|js)$/);

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
  var dirname = ks[ks.length - 2];

  if (gallery[dirname] && path_1["default"].basename(filename, path_1["default"].extname(filename)) === 'index') {
    _extends(gallery[dirname], context(key));
  }

  _extends(exportObj, context(key));
});
var components = gallery.components;
gallery.components = {
  hc: components
};
galleryResolver_1.setGallery(gallery);
exports["default"] = exportObj;
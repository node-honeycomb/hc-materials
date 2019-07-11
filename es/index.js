function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import path from 'path';
import { setGallery } from './layers/galleryResolver';

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

  if (gallery[dirname] && path.basename(filename, path.extname(filename)) === 'index') {
    _extends(gallery[dirname], context(key));
  }

  _extends(exportObj, context(key));
});
var components = gallery.components;
gallery.components = {
  hc: components
};
setGallery(gallery);
module.exports = exportObj;
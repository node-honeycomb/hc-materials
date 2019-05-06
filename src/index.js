import path from 'path';
import {setGallery} from './layers/galleryResolver';
const context = require.context('./', true, /^((?!style).)+\/\w+\.jsx?$/);

const exportObj = {};
const gallery = {
  layers: {},
  layouts: {},
  services: {},
  components: {}
};
context
  .keys()
  .forEach(key => {
    const ks = key.split('/');
    const filename = ks.pop();
    const len = ks.length;
    const dirname = ks[len - 2];
    if (gallery[dirname] && path.basename(filename, path.extname(filename)) === 'index') {
      Object.assign(gallery[dirname], context(key));
    }
    Object.assign(exportObj, context(key));
  });

const components = gallery.components;
gallery.components = {
  hc: components
};
setGallery(gallery);

module.exports = exportObj;

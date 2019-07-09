'use strict';
var path = require('path');

module.exports = {
  lazyLoad: true,
  pick: {
    posts: function posts(markdownData) {
      return {
        meta: markdownData.meta,
        description: markdownData.description
      };
    }
  },
  plugins: [
    'bisheng-plugin-toc',
    'bisheng-plugin-description',
    'bisheng-plugin-react?lang=jsx',
  ],
  routes: [{
    path: '/',
    component: './template/Archive'
  // }, {
  //   path: '/docs/:type/:component/:post',
  //   dataPath: '/:type/:component/:post',
  //   component: './template/Post',
  }, {
    path: '/:type/:component/demo/:post',
    // dataPath: '/src/:type/:component/demo/:post',
    component: './template/Post',
  // }, {
  //   path: '/posts/:post',
  //   dataPath: '/:post',
  //   component: './template/Post'
  }, {
    path: '/tags',
    component: './template/TagCloud'
  }]
};

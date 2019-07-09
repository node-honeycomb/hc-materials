var path = require('path')

module.exports = {
  port: 8001,
  source: './src',
  output: './docs',
  theme: './_theme/',
  // theme: 'bisheng-theme-one',
  // plugins: [
  //   'bisheng-plugin-react?lang=jsx',
  //   'bisheng-plugin-toc?maxDepth=2',
  //   'bisheng-plugin-description',
  // ],
  // htmlTemplate: path.join(__dirname, './template.html'),
  // devServerConfig: {},
  webpackConfig(config) {
    // config.module.rules[11].use[3].options = {
    //   javascriptEnabled: true
    // }
    return config;
  },
  themeConfig: {
		home: '/',
		sitename: 'hc-doc',
		tagline: '',
		// navigation: [{
		//   title: 'BiSheng',
		//   link: 'https://github.com/benjycui/bisheng',
		// }],
		// footer: 'Copyright and so on...',
		hideBisheng: true,
		github: 'https://github.com/node-honeycomb/hc-materials',
	},
  hash: false,
  // entryName: 'index',
  root: '/',
};

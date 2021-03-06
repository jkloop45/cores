const webpack = require('atool-build/lib/webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(webpackConfig, env) {
  webpackConfig.babel.plugins.push('transform-runtime');
  // webpackConfig.plugins.push(
  //     new HtmlWebpackPlugin({
  //       filename: 'index.html',
  //       template: 'src/index.html',
  //       inject: true
  //     })
  // )

  // Support hmr
  if (env === 'development') {
    webpackConfig.devtool = '#eval';
    webpackConfig.babel.plugins.push('dva-hmr');
  } else {
    webpackConfig.babel.plugins.push('dev-expression');
  }

  // Don't extract common.js and common.css
  webpackConfig.plugins = webpackConfig.plugins.filter(function(plugin) {
    return !(plugin instanceof webpack.optimize.CommonsChunkPlugin);
  });


    try {
        webpackConfig.plugins.push(
          new CopyWebpackPlugin([
            {
              from: 'node_modules/monaco-editor/min/vs',
              to: 'vs',
            }
          ])
        );
    } catch (e) {
        new CopyWebpackPlugin([
          {
            from: 'node_modules/react-monaco-editor/node_modules/monaco-editor/min/vs',
            to: 'vs',
          }
        ])
    } finally {

    }

     // webpackConfig.plugins.push(
     //      new CopyWebpackPlugin([
     //        {
     //          from: 'node_modules/react/min/vs',
     //          to: 'vs',
     //        }
     //      ])
     //    );


  // Support CSS Modules
  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function(loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.include = /node_modules/;
      loader.test = /\.less$/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.exclude = /node_modules/;
      loader.test = /\.less$/;
    }
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.css$') > -1) {
      loader.include = /node_modules/;
      loader.test = /\.css$/;
    }
    if (loader.test.toString() === '/\\.module\\.css$/') {
      loader.exclude = /node_modules/;
      loader.test = /\.css$/;
    }
  });

  webpackConfig.babel.plugins.push(['import', {
    libraryName: 'antd',
    style: 'css',
  }]);

  // webpackConfig.externals = {
  //   'react': 'window.React'
  // }


  return webpackConfig;
};

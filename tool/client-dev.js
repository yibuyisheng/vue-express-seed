module.exports = function(app) {
    require('../client/build/check-versions')()

    var config = require('../client/config')
    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
    }

    var opn = require('opn')
    var path = require('path')
    var webpack = require('webpack')
    var webpackConfig = process.env.NODE_ENV === 'testing'
        ? require('../client/build/webpack.prod.conf')
        : require('../client/build/webpack.dev.conf')

    var compiler = webpack(webpackConfig)

    var devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: true
    })

    var hotMiddleware = require('webpack-hot-middleware')(compiler, {
            log: () => {}
        })
        // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
            hotMiddleware.publish({ action: 'reload' })
            cb()
        })
    })

    // handle fallback for HTML5 history API
    app.use(require('connect-history-api-fallback')())

    // serve webpack bundle output
    app.use(devMiddleware)

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware)

    // serve pure static assets
    var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
    app.use(staticPath, require('express').static('./static'))
};

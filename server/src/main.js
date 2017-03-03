/**
 * @file 主入口文件
 * @author zhangli25(zhangli25@baidu.com)
 */

var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');
var config = require('./config');
var session = require('express-session');

var app = express();

app.use(session({
    secret: 'sessionid',
    resave: false,
    saveUninitialized: true
}));

if (config.phase === 'dev') {
    winston.addColors({
        info: 'green',
        error: 'red',
        warn: 'orange'
    });

    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// 各种数据接口配置
app.use('/api', function (req, res) {
    res.end('success');
});

if (config.phase === 'dev') {
    require('../../tool/client-dev')(app);
}

// 最后的垫底中间件，处理未知错误
app.use(function (err, req, res, next) {
    winston.error(err.stack);
    res.json({
        success: false,
        message: {
            global: err.message
        }
    });
});

module.exports = app;

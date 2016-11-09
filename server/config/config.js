/**
 * 默认配置
 * Created by galen on 16/11/7.
 */
'use strict';

const pkg = require('../../package.json');

module.exports = function init() {

    return {

        // app基本信息
        app: {
            name: pkg.name,
            description: pkg.description,
            version: pkg.version,
            keywords: pkg.keywords ? pkg.keywords.join(',') : ''
        },

        // 启动端口
        port: process.env.PORT || 3000,

        // app logo
        logo: 'public/img/logo.png',

        // 浏览器tab图标
        favicon: 'public/img/favicon.ico',

        // 启用的中间件
        middlewares: {
            bodyparser: {
                index: 1,
                config: {
                    formLimit: '200kb',
                    jsonLimit: '2mb',
                    textLimit: '2mb',
                    strict: false,
                }
            },
            json: {
                index: 2,
                config: {
                    pretty: false,
                    param: 'pretty'
                }
            }
        }

    }
};

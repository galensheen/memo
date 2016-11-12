/**
 * 预发环境配置
 * Created by galen on 16/11/7.
 */
'use strict';

/**
 *
 * @param {Object} appInfo - app基本信息
 */
module.exports = function prod(appInfo) {

    return {

        env: 'prod',

        // 日志配置
        logger: {
            name: appInfo.name,
            streams: [{
                level: 'error',
                type: 'rotating-file',
                period: '1d',
                count: 10,
                path: appInfo.appDir + '/logs/error.log',
            }]
        },

        redis: {
            db: 1
        },

        mysql: {
            username: 'prod',
            password: 'prod-password'
        }
    }
};

/**
 * Created by galen on 16/11/14.
 */

import KoaRouter from 'koa-router';
import utility from 'utility';
import inflection from 'inflection';
import methods from 'methods';
import Debug from 'debug';

const join = require('path').join;
const slice = Array.prototype.slice;
const debug = new Debug('memo:Router');

const REST_MAP = {
    index: {
        suffix: '',
        method: 'GET'
    },
    new: {
        namePrefix: 'new_',
        member: true,
        suffix: 'new',
        method: 'GET'
    },
    create: {
        suffix: '',
        method: 'POST'
    },
    show: {
        member: true,
        suffix: ':id',
        method: 'GET'
    },
    edit: {
        member: true,
        namePrefix: 'edit_',
        suffix: ':id/edit',
        method: 'GET'
    },
    update: {
        member: true,
        namePrefix: '',
        suffix: ':id',
        method: 'PUT'
    },
    delete: {
        member: true,
        namePrefix: 'delete_',
        suffix: ':id',
        method: 'DELETE'
    }
};


class Router extends KoaRouter {

    constructor(options, app) {

    }
}

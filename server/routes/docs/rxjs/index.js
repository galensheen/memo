/**
 * Created by galen on 16/11/20.
 */

export default function (router, app) {

    router.prefix('/docs/rxjs');

    router.get( '/', 'docs.rxjs.indexController.index');
};

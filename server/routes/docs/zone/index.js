/**
 * Created by galen on 16/11/23.
 */

export default function (router, app) {
    router.prefix('/docs/zone');

    router.get('/', 'docs.zone.indexController.index')
}

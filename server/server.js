/**
 * Created by galen on 16/11/9.
 */

const Koa = require('koa');

const app = new Koa();

app.use(async (ctx, next) => {
    ctx.body = {test: 'Just a test!'};
});

app.listen(3000);

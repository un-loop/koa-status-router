const Router = require("koa-router");
const compose = require("koa-compose");

const supportedMethods = [
    "get",
    "post",
    "put",
    "link",
    "unlink",
    "delete",
    "del",
    "head",
    "options",
    "patch",
    "all"
];

module.exports = function(router) {
    router = router || new Router();

    const route = (method, status, ...middleware) => {

        const composed = compose(middleware);
        const routeMiddleware  = async (ctx, next) => {
            try {
                await next();
            } catch(ex) {
                ctx.status = 500;
            } finally {
                const finished = () => {};

                if (ctx.status === status) {
                    await composed(ctx, finished);
                } else {
                    finished();
                }
            }
        }

        return router[method]("*", routeMiddleware);
    }

    for(let method of supportedMethods) {
        this[method] = route.bind(this, method);
    }

    this.middleware = router.middleware.bind(router);
}

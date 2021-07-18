const  Koa = require('koa');
const serveStaticPlugin = require('./plugins/server/serveStaticPlugin');
const rewriteModulePlugin=require('./plugins/server/rewriteModulePlugin');
const moduleResolvePlugin=require('./plugins/server/moduleResolvePlugin');

function createServer() {
    const app = new Koa();
    const root = process.cwd();
    const context = {
        app,
        root
    }
    const resolvePlugins = [
        // 重写模块路径
        rewriteModulePlugin,
        // 解析模块路径
        moduleResolvePlugin,
        // 配置静态资源服务
        serveStaticPlugin,
    ]
    resolvePlugins.forEach(f => f(context));
    return app;
}
module.exports = createServer;
createServer().listen(3002);
const  Koa = require('koa');
const websocket = require('koa-easy-ws')
const serveStaticPlugin = require('./plugins/server/serveStaticPlugin');
const rewriteModulePlugin=require('./plugins/server/rewriteModulePlugin');
const moduleResolvePlugin=require('./plugins/server/moduleResolvePlugin');
const hmrWatcherPlugin=require('./plugins/server/hmrWatcherPlugin');

function createServer() {
    const app = new Koa();
    app.use(websocket())
    const root = process.cwd();
    const context = {
        app,
        root
    }
    const resolvePlugins = [
        // 监听文件变化，处理hmr
        hmrWatcherPlugin,
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
const fs = require('fs');
const path = require('path');
const chokidar =require('chokidar');

module.exports = function ({ app,root }) {
    const hmrClientCode = fs.readFileSync(path.resolve(__dirname, '../client/hmrClient.js'))
    app.use(async (ctx, next) => {
        await next();
        if (ctx.url === '/__hmrClient') {
            ctx.type = 'js';
            ctx.body = hmrClientCode;
        }
            if(ctx.ws){
                const ws=await ctx.ws();
                const watcher = chokidar.watch(root, {
                    ignored: [/node_modules/]
                });
                watcher.on('change',async ()=>{
                        ws.send(JSON.stringify({ type: 'update' }));
                })
            }
    })
}
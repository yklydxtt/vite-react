const path = require('path');
const { parse } = require('es-module-lexer');
const {Readable} =require('stream');
const resolve=require('resolve-from');
const MagicString = require('magic-string');

async function readBody(stream){
    if(stream instanceof Readable){
        return new Promise((resolve,reject)=>{
            let res='';
            stream.on('data',(data)=>res+=data);
            stream.on('end',()=>resolve(res));
            stream.on('error',(e)=>reject(e));
        })
    }else{
        return stream.toString();
    }
}
function getModulePath(root,name){
    const pkgPath=path.join(root,'node_modules',name,'package.json');
    const modulePkg=require(pkgPath);
    const modulePath=path.join(path.dirname(pkgPath),modulePkg.main);
    // 用于解析其他模块路径
    return modulePath;
}

function rewriteImports(source,modulePath){
    const imports=parse(source)[0];
    const magicString=new MagicString(source);
    imports.forEach(item=>{
        const {s,e}=item;
        let id = source.substring(s,e);
        const reg = /^[^\/\.]/;
        const moduleReg=/^\/__module\//;
        if(moduleReg.test(modulePath)){
            if(modulePath.endsWith('.js')){
                id=`${path.dirname(modulePath)}/${id}`
            }else{
                id=`${modulePath}/${id}`;
            }
            magicString.overwrite(s,e,id);
            return;
        }
        if(reg.test(id)){
            id=`/__module/${id}`;
            magicString.overwrite(s,e,id);
        }
    });
    return magicString.toString();
}

function rewriteModlueImports(source){

}

function resolveModule(cwd,moduleName){
    let modulePath;
    if(moduleName.endsWith('.js')){
        modulePath=path.join(path.dirname(resolve(cwd,moduleName)),path.basename(moduleName));
        return modulePath;
    }
    const userModulePkg=resolve(cwd,`${moduleName}/package.json`);
    modulePath=path.join(path.dirname(userModulePkg),'index.js');
    return modulePath;
}

exports.rewriteModlueImports=rewriteModlueImports;
exports.resolveModule=resolveModule;
exports.readBody=readBody;
exports.getModulePath=getModulePath;
exports.rewriteImports=rewriteImports;
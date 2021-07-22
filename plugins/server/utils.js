const path = require('path');
const esbuild=require('esbuild');
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

function rewriteImports(source,modulePath){
    const code=esbuild.transformSync(source, {
        loader: 'jsx',
      }).code;
    const imports=parse(code)[0];
    const magicString=new MagicString(code);
    imports.forEach(item=>{
        const {s,e}=item;
        let id = code.substring(s,e);
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

function resolveModule(root,moduleName){
    let modulePath;
    if(moduleName.endsWith('.js')){
        modulePath=path.join(path.dirname(resolve(root,moduleName)),path.basename(moduleName));
        return modulePath;
    }
    const userModulePkg=resolve(root,`${moduleName}/package.json`);
    modulePath=path.join(path.dirname(userModulePkg),'index.js');
    return modulePath;
}

exports.resolveModule=resolveModule;
exports.readBody=readBody;
exports.rewriteImports=rewriteImports;
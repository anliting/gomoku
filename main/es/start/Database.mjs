import fs from'fs'
import afs from'@anliting/fs'
import rmrf from'rmrf'
import os from'os'
let edge={
    '0':async function(){
        await fs.promises.mkdir('data-next/tmp')
        await fs.promises.mkdir('data-next/user')
        await fs.promises.mkdir('data-next/user/user')
        await fs.promises.mkdir('data-next/user/user/0')
        await fs.promises.writeFile('data-next/user/main',JSON.stringify({
            mode:'single',
        }))
        await Promise.all([
            afs.fsyncByPath('data-next'),
            afs.fsyncByPath('data-next/tmp'),
            afs.fsyncByPath('data-next/user'),
            afs.fsyncByPath('data-next/user/user'),
            afs.fsyncByPath('data-next/user/user/0'),
            afs.fsyncByPath('data-next/user/main'),
        ])
        return'1'
    },
}
async function getVersion(){
    try{
        return['pre',
            await fs.promises.readFile('data-next/version','utf8')
        ]
    }catch(e){
        if(!(e.code=='ENOENT'))
            throw e
    }
    try{
        return[0,
            await fs.promises.readFile('data/version','utf8')
        ]
    }catch(e){
        if(!(e.code=='ENOENT'))
            throw e
    }
    return[0,'0']
}
async function setVersion(v){
    await fs.promises.writeFile('data-next/tmp/version',v)
    await afs.fsyncByPath('data-next/tmp/version')
    await fs.promises.rename('data-next/tmp/version','data-next/version')
    await afs.fsyncByPath('data-next')
}
async function load(){
    for(;;){
        let v=await getVersion()
        if(v[0]=='pre'){
            await rmrf('data')
            await fs.promises.rename('data-next','data')
            await afs.fsyncByPath('.')
            continue
        }
        if(v[1] in edge){
            await rmrf('data-next')
            await afs.mkdirFsync('data-next')
            await setVersion(await edge[v[1]]())
            continue
        }
        break
    }
}
function Database(){
    this._ready=load.call(this)
}
Database.prototype.getUserMode=function(){
    return this._ready=(async()=>{
        await this._ready
        return JSON.parse(
            await fs.promises.readFile('data/user/main','utf8')
        ).mode
    })()
}
Database.prototype.setPassword=function(user,password){
    return this._ready=(async()=>{
        await this._ready
        let
            userPath=`data/user/user/${user}`,
            passwordPath=`${userPath}/password`
        await fs.promises.writeFile(passwordPath,password)
    })()
}
Database.prototype.testCredential=function(user,password){
    return this._ready=(async()=>{
        await this._ready
        let
            userPath=`data/user/user/${user}`,
            passwordPath=`${userPath}/password`
        try{
            return!(
                await fs.promises.readFile(passwordPath)
            ).compare(password)
        }catch(e){
            if(e.code=='ENOENT')
                return 0
            throw e
        }
    })()
}
export default Database

import doe from         './lib/doe/main/doe.mjs'
import load from        './load.mjs'
import style from       './Sandbox/style.mjs'
import element from     './Sandbox/element.mjs'
import Peice from       './Sandbox/Peice.mjs'
import createBoard from './Sandbox/createBoard.mjs'
import drawBoard from   './Sandbox/drawBoard.mjs'
function clickObject(object){
    if(this._status.object)
        this._ui[this._status.object].unhighlight()
    if(this._status.object==object)
        this._status.object=0
    else{
        this._status.object=object
        this._ui[this._status.object].highlight()
    }
}
function createBoardStatus(){
    let a={}
    for(let i=0;i<15;i++){
        a[i]={}
        for(let j=0;j<15;j++)
            a[i][j]=0
    }
    return a
}
function createPeice(type){
    let p=new Peice(type)
    p.node.onclick=e=>
        clickObject.call(this,type)
    return p
}
function Sandbox(){
    this._status={
        devicePixelRatio:1,
        board:createBoardStatus(),
        cursor:0,
        object:0,
        text:0,
        mouseBoard:[{
            active:1,
            in:0,
        }],
    }
    this._do={}
    this._ui={
        black:createPeice.call(this,'black'),
        white:createPeice.call(this,'white'),
        placeholder:createPeice.call(this,'placeholder'),
    }
    clickObject.call(this,'black')
    this.node=doe.div(
        {className:'sandbox'},
        doe.div(
            {className:'left'},
            this._ui.black.node,
            ' ',
            this._ui.white.node,
            ' ',
            this._ui.placeholder.node,
        ),
        createBoard.call(this),
        doe.div(
            {className:'right'},
            doe.span({className:'click',onclick:_=>{
                this._do.boardCanvas.toBlob(blob=>{
                    load.download(URL.createObjectURL(blob),'棋盤.png')
                })
            }},'儲存為圖片'),
        ),
    )
    this.devicePixelRatio=1.5
}
Sandbox.style=style
Sandbox.prototype._drawBoard=drawBoard
Sandbox.prototype._setPause=function(){
    this._status.mouseBoard[0].active=!this._status.text
}
Sandbox.prototype._resizeBoardCanvas=function(){
    this._do.boardCanvas.width=450*this._status.devicePixelRatio
    this._do.boardCanvas.height=450*this._status.devicePixelRatio
    this._drawBoard()
    this._do.boardCanvas.style.transform=`scale(${
        1/this._status.devicePixelRatio
    })`
}
Object.defineProperty(Sandbox.prototype,'devicePixelRatio',{get(){
    return this._status.devicePixelRatio
},set(v){
    this._status.devicePixelRatio=v
    this._resizeBoardCanvas()
}})
export default Sandbox

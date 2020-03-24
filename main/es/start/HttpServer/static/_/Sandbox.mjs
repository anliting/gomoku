import doe from         './lib/doe/main/doe.mjs'
import load from        './load.mjs'
import style from       './Sandbox/style.mjs'
import element from     './Sandbox/element.mjs'
import Peice from       './Sandbox/Peice.mjs'
import createBoard from './Sandbox/createBoard.mjs'
function clickObject(object){
    if(this._status.object)
        this._ui[this._status.object].unhighlight()
    if(this._status.object==object)
        return this._status.object=0
    this._status.object=object
    this._ui[this._status.object].highlight()
}
function Sandbox(){
    this._status={
        board:{},
        cursor:0,
        object:0,
        mouseBoard:['out'],
    }
    for(let i=0;i<15;i++){
        this._status.board[i]={}
        for(let j=0;j<15;j++)
            this._status.board[i][j]=0
    }
    this._ui={
        black:new Peice('black'),
        white:new Peice('white'),
        placeholder:new Peice('placeholder'),
    }
    clickObject.call(this,'black')
    this._ui.black.node.onclick=e=>{
        clickObject.call(this,'black')
    }
    this._ui.white.node.onclick=e=>{
        clickObject.call(this,'white')
    }
    this._ui.placeholder.node.onclick=e=>{
        clickObject.call(this,'placeholder')
    }
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
            doe.span({className:'click',onclick(){
                canvas.toBlob(blob=>{
                    load.download(URL.createObjectURL(blob),'棋盤.png')
                })
            }},'儲存為圖片'),
        ),
    )
}
Sandbox.style=style
export default Sandbox

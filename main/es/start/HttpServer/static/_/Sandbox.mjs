import doe from         './lib/doe/main/doe.mjs'
import load from        './load.mjs'
import style from       './Sandbox/style.mjs'
import element from     './Sandbox/element.mjs'
import Peice from       './Sandbox/Peice.mjs'
function drawBoard(context){
    context.lineWidth=2
    context.fillStyle='#888'
    context.fillRect(0,0,450,450)
    context.fillStyle='#000'
    for(let i=0;i<15;i++){
        context.fillRect(i*30+15-1,15-1,2,30*14+2)
        context.fillRect(15-1,i*30+15-1,30*14+2,2)
    }
    for(let x=0;x<15;x++)
    for(let y=0;y<15;y++)
    if(this._status.board[x][y]){
        context.fillStyle=element[this._status.board[x][y]].color
        context.beginPath()
        context.arc(
            30*x+15,30*y+15,element[this._status.board[x][y]].radius,
            0,2*Math.PI
        )
        context.fill()
    }
    if(this._status.cursor){
        let[x,y]=this._status.cursor
        if(!this._status.board[x][y]){
            context.fillStyle=element[this._status.object].color
            context.beginPath()
            context.arc(
                30*x+15,30*y+15,element[this._status.object].radius,
                0,2*Math.PI
            )
            context.fill()
        }
    }
}
function getCoordinate(e){
    let
        x=~~(e.offsetX/30),y=~~(e.offsetY/30),
        xr=e.offsetX%30,yr=e.offsetY%30
    if(
        (xr-15)**2+(yr-15)**2<=15**2
    )
        return[x,y]
}
function setObject(object){
    this._ui[this._status.object].unhighlight()
    this._status.object=object
    this._ui[this._status.object].highlight()
}
function Sandbox(){
    this._status={
        board:{},
        cursor:0,
        object:'black',
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
    this._ui.black.highlight()
    this._ui.black.node.onclick=e=>{
        setObject.call(this,'black')
    }
    this._ui.white.node.onclick=e=>{
        setObject.call(this,'white')
    }
    this._ui.placeholder.node.onclick=e=>{
        setObject.call(this,'placeholder')
    }
    let canvas
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
        canvas=doe.canvas(
            {width:450,height:450}
        ),
        doe.div(
            {className:'right'},
            doe.span({className:'click',onclick(){
                canvas.toBlob(blob=>{
                    load.download(URL.createObjectURL(blob),'棋盤.png')
                })
            }},'儲存為圖片'),
        ),
    )
    let context=canvas.getContext('2d')
    drawBoard.call(this,context)
    canvas.oncontextmenu=e=>{
        e.preventDefault()
    }
    canvas.onmousemove=e=>{
        this._status.cursor=getCoordinate(e)
        drawBoard.call(this,context)
    }
    canvas.onmouseleave=e=>{
        this._status.cursor=0
        drawBoard.call(this,context)
    }
    canvas.onclick=e=>{
        let coordinate
        if(coordinate=getCoordinate(e)){
            let[x,y]=coordinate
            if(!this._status.board[x][y])
                this._status.board[x][y]=this._status.object
        }
        drawBoard.call(this,context)
    }
    canvas.onauxclick=e=>{
        if(!(e.button==2))
            return
        let coordinate
        if(coordinate=getCoordinate(e)){
            let[x,y]=coordinate
            this._status.board[x][y]=0
        }
        drawBoard.call(this,context)
    }
}
Sandbox.style=style
export default Sandbox

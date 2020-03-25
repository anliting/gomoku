import doe from         '../lib/doe/main/doe.mjs'
import element from     './element.mjs'
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
    if(
        this._status.mouseBoard[0]=='in'&&
        ['cursor','put'].includes(this._status.mouseBoard[1])&&
        this._status.cursor
    ){
        let[x,y]=this._status.cursor
        if(this._status.object&&!this._status.board[x][y]){
            context.fillStyle=element[this._status.object].transparentColor
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
function coordinateEqual(a,b){
    return a&&b&&a[0]==b[0]&&a[1]==b[1]
}
function mouseBoardEnterCursor(e){
    this._status.mouseBoard[1]='cursor'
    this._status.cursor=getCoordinate(e)
}
function createBoard(){
    let canvas=doe.canvas(
        {width:450,height:450}
    )
    let context=canvas.getContext('2d')
    drawBoard.call(this,context)
    canvas.oncontextmenu=e=>{
        e.preventDefault()
    }
    canvas.onmouseenter=e=>{
        this._status.mouseBoard=['in']
        if(!e.buttons){
            mouseBoardEnterCursor.call(this,e)
            drawBoard.call(this,context)
        }
    }
    canvas.onmouseleave=e=>{
        this._status.mouseBoard=0
        drawBoard.call(this,context)
    }
    canvas.onmousemove=e=>{
        if(this._status.mouseBoard[1]=='cursor'){
            this._status.cursor=getCoordinate(e)
            drawBoard.call(this,context)
        }
    }
    canvas.onmousedown=e=>{
        if(this._status.mouseBoard[1]=='cursor')
            if(e.button==0){
                this._status.mouseBoard[1]='put'
                if(this._status.cursor){
                    let[x,y]=this._status.cursor
                    if(this._status.board[x][y])
                        this._status.mouseBoard[1]='text'
                }
                drawBoard.call(this,context)
            }else if(e.button==2){
                this._status.mouseBoard[1]='cut'
                drawBoard.call(this,context)
            }
    }
    canvas.onmouseup=e=>{
        let change
        if(this._status.mouseBoard[1]=='put'&&e.button==0){
            if(coordinateEqual(this._status.cursor,getCoordinate(e))){
                let[x,y]=this._status.cursor
                if(!this._status.board[x][y])
                    this._status.board[x][y]=this._status.object
            }
            this._status.mouseBoard[1]=0
            change=1
        }
        if(this._status.mouseBoard[1]=='cut'&&e.button==2){
            if(coordinateEqual(this._status.cursor,getCoordinate(e))){
                let[x,y]=this._status.cursor
                this._status.board[x][y]=0
            }
            this._status.mouseBoard[1]=0
            change=1
        }
        if(this._status.mouseBoard[1]=='text'&&e.button==0){
            if(coordinateEqual(this._status.cursor,getCoordinate(e))){
                console.log('text')
            }
            this._status.mouseBoard[1]=0
            change=1
        }
        if(!this._status.mouseBoard[1]&&!e.buttons){
            mouseBoardEnterCursor.call(this,e)
            change=1
        }
        if(change)
            drawBoard.call(this,context)
    }
    return doe.div({className:'board'},canvas)
}
export default createBoard

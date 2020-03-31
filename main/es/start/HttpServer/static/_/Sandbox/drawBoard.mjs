import element from     './element.mjs'
function drawBoard(){
    let context=this._do.boardCanvasContext
    context.setTransform(
        this._status.devicePixelRatio,0,0,
        this._status.devicePixelRatio,0,0
    )
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
        context.fillStyle=element[this._status.board[x][y][0]].color
        context.beginPath()
        context.arc(
            30*x+15,30*y+15,element[this._status.board[x][y][0]].radius,
            0,2*Math.PI
        )
        context.fill()
        if(this._status.board[x][y][1]){
            context.fillStyle=
                element[this._status.board[x][y][0]].textColor
            context.font=`10px monospace`
            context.textAlign='center'
            context.textBaseline='middle'
            context.fillText(this._status.board[x][y][1],30*x+15,30*y+15)
        }
    }
    if(!(
        this._status.mouseBoard[0].active&&
        this._status.mouseBoard[0].in&&
        this._status.object
    ))
        return
    let cursor
    if(this._status.mouseBoard[1]=='cursor')
        cursor=this._status.cursor
    else if(this._status.mouseBoard[1]=='put')
        cursor=this._status.previousCursor
    if(!cursor)
        return
    let[x,y]=cursor
    if(this._status.object&&!this._status.board[x][y]){
        context.fillStyle=
            element[this._status.object].transparentColor
        context.beginPath()
        context.arc(
            30*x+15,30*y+15,element[this._status.object].radius,
            0,2*Math.PI
        )
        context.fill()
    }
}
export default drawBoard

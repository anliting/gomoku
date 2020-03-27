import doe from         '../lib/doe/main/doe.mjs'
import element from     './element.mjs'
import drawBoard from   './createBoard/drawBoard.mjs'
import createMouseDownMouseUp from
    './createBoard/createMouseDownMouseUp.mjs'
function getCoordinate(e){
    let
        x=~~(e.offsetX/30),y=~~(e.offsetY/30),
        xr=e.offsetX%30,yr=e.offsetY%30
    if(
        (xr-15)**2+(yr-15)**2<=15**2
    )
        return[x,y]
}
function createBoard(){
    this._do.board=doe.div({className:'board'},
        this._do.boardCanvas=doe.canvas(
            {width:450,height:450}
        )
    )
    this._do.boardCanvasContext=this._do.boardCanvas.getContext('2d')
    drawBoard.call(this)
    this._do.boardCanvas.oncontextmenu=e=>{
        e.preventDefault()
    }
    this._do.boardCanvas.onmouseenter=e=>{
        this._status.mouseBoard[0].in=1
        this._status.cursor=getCoordinate(e)
        if(this._status.mouseBoard[0].active){
            this._status.mouseBoard[1]='cursor'
            drawBoard.call(this)
        }
    }
    this._do.boardCanvas.onmouseleave=e=>{
        this._status.mouseBoard[0].in=0
        drawBoard.call(this)
    }
    this._do.boardCanvas.onmousemove=e=>{
        this._status.cursor=getCoordinate(e)
        drawBoard.call(this)
    }
    Object.assign(
        this._do.boardCanvas,
        createMouseDownMouseUp.call(this)
    )
    return this._do.board
}
export default createBoard

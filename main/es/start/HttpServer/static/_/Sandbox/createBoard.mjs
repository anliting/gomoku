import doe from         '../lib/doe/main/doe.mjs'
import element from     './element.mjs'
import createMouseDownMouseUp from
    './createBoard/createMouseDownMouseUp.mjs'
function getCoordinate(e){
    let 
        offsetX=e.offsetX/this._status.devicePixelRatio,
        offsetY=e.offsetY/this._status.devicePixelRatio,
        x=~~(offsetX/30),y=~~(offsetY/30),
        xr=offsetX%30,yr=offsetY%30
    if((xr-15)**2+(yr-15)**2<=15**2)
        return[x,y]
}
function createBoard(){
    this._do.board=doe.div({className:'board'},
        this._do.boardCanvas=doe.canvas(
            {width:450,height:450}
        )
    )
    this._do.boardCanvasContext=this._do.boardCanvas.getContext('2d')
    this._drawBoard()
    this._do.boardCanvas.oncontextmenu=e=>{
        e.preventDefault()
    }
    this._do.boardCanvas.onmouseenter=e=>{
        this._status.mouseBoard[0].in=1
        this._status.cursor=getCoordinate.call(this,e)
        if(this._status.mouseBoard[0].active){
            this._status.mouseBoard[1]='cursor'
            this._drawBoard()
        }
    }
    this._do.boardCanvas.onmouseleave=e=>{
        this._status.mouseBoard[0].in=0
        this._drawBoard()
    }
    this._do.boardCanvas.onmousemove=e=>{
        this._status.cursor=getCoordinate.call(this,e)
        this._drawBoard()
    }
    Object.assign(
        this._do.boardCanvas,
        createMouseDownMouseUp.call(this)
    )
    return this._do.board
}
export default createBoard

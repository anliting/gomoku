import doe from         '../../lib/doe/main/doe.mjs'
import element from     '../element.mjs'
import drawBoard from   './drawBoard.mjs'
function coordinateEqual(a,b){
    return a&&b&&a[0]==b[0]&&a[1]==b[1]
}
function createMouseDownMouseUp(){
    let o={}
    o.onmousedown=e=>{
        if(!(
            this._status.mouseBoard[0].active&&
            this._status.mouseBoard[1]=='cursor'
        ))
            return
        if(e.button==0){
            this._status.previousCursor=this._status.cursor
            this._status.mouseBoard[1]='put'
            if(this._status.cursor){
                let[x,y]=this._status.cursor
                if(this._status.board[x][y])
                    this._status.mouseBoard[1]='textClick'
            }
            drawBoard.call(this)
        }else if(e.button==2){
            this._status.previousCursor=this._status.cursor
            this._status.mouseBoard[1]='cut'
            drawBoard.call(this)
        }
    }
    o.onmouseup=e=>{
        if(!this._status.mouseBoard[0].active)
            return
        let change
        if(this._status.mouseBoard[1]=='put'&&e.button==0){
            if(coordinateEqual(
                this._status.previousCursor,
                this._status.cursor
            )){
                let[x,y]=this._status.cursor
                if(!this._status.board[x][y])
                    this._status.board[x][y]=[this._status.object]
            }
            change=1
        }
        if(this._status.mouseBoard[1]=='cut'&&e.button==2){
            if(coordinateEqual(
                this._status.previousCursor,
                this._status.cursor
            )){
                let[x,y]=this._status.cursor
                this._status.board[x][y]=0
            }
            change=1
        }
        if(this._status.mouseBoard[1]=='textClick'&&e.button==0){
            if(coordinateEqual(
                this._status.previousCursor,
                this._status.cursor
            )){
                let[x,y]=this._status.cursor
                this._status.text=1
                this._setPause()
                let input
                let f=()=>{
                    this._status.text=0
                    this._setPause()
                    this._status.board[x][y][1]=input.value
                    doe(this._do.board,1,input)
                    if(this._status.mouseBoard[0].in)
                        this._status.mouseBoard[1]='cursor'
                    drawBoard.call(this)
                }
                doe(this._do.board,
                    input=doe.textarea({
                        className:'input',
                        maxLength:2,
                        value:this._status.board[x][y][1]||'',
                        onblur(){
                            f()
                        },
                        onkeydown(e){
                            if(e.key=='Enter')
                                f()
                        },
                    },n=>{doe(n.style,{
                        left:`${30*x}px`,
                        top:`${30*y}px`,
                        color:element[this._status.board[x][y][0]].
                            textColor,
                    })}),
                )
                this._status.board[x][y][1]=''
                input.focus()
            }
            change=1
        }
        if(change){
            this._status.mouseBoard[1]='cursor'
            drawBoard.call(this)
        }
    }
    return o
}
export default createMouseDownMouseUp

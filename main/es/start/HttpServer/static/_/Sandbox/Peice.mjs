import doe from         '../lib/doe/main/doe.mjs'
import element from     './element.mjs'
function drawPeice(context){
    context.fillStyle=element[this._color].color
    context.beginPath()
    context.arc(17,17,element[this._color].radius,0,2*Math.PI)
    context.fill()
}
function drawHighlight(context){
    context.strokeStyle='#3bf'
    context.lineWidth=2
    context.beginPath()
    context.arc(17,17,element[this._color].radius+1,0,2*Math.PI)
    context.closePath()
    context.stroke()
}
function Peice(color){
    this._color=color
    this.node=doe.canvas({width:34,height:34})
    let context=this.node.getContext('2d')
    drawPeice.call(this,context)
}
Peice.prototype.highlight=function(){
    let context=this.node.getContext('2d')
    context.clearRect(0,0,34,34)
    drawPeice.call(this,context)
    drawHighlight.call(this,context)
}
Peice.prototype.unhighlight=function(){
    let context=this.node.getContext('2d')
    context.clearRect(0,0,34,34)
    drawPeice.call(this,context)
}
export default Peice

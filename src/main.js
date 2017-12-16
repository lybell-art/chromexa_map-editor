var screenControl;	//class that control screen
var inputBroadcast;	//user-input varient class
var field=null;
var kind=1;
var who=1;
var rowSlider;
var colSlider;

function setup()
{
	createCanvas(windowWidth,windowHeight);
	inputBroadcast=new BROADCAST();
	screenControl=new SCREEN_CONTROL(width,height);
	field=new FIELD();
	field.makeField(10,10);
	screenControl.set(this.field.w,this.field.h);
	rowSlider = createSlider(0, 50, 10, 1);
 	rowSlider.position(10, 10);
	rowSlider.changed(changer);
	colSlider = createSlider(0, 50, 10, 1);
 	colSlider.position(10, 40);
	rowSlider.changed(changer);
}
function draw()
{
	inputBroadcast.renew();
	var clickSignal;
	clickSignal=this.field.clickCheck();
	if(clickSignal!==null)
	{
		this.field.cells[clickSignal.index.row][clickSignal.index.col].kind=kind;
		this.field.cells[clickSignal.index.row][clickSignal.index.col].who=who;
	}
	background(255);
	screenControl.setScreen();
	field.draw();
}
function mousePressed()
{
	inputBroadcast.isMousePress=true;
	inputBroadcast.dmouseX=mouseX;
	inputBroadcast.dmouseY=mouseY;
}
function mouseDragged()
{
	var deltaX=mouseX-inputBroadcast.dmouseX;
	var deltaY=mouseY-inputBroadcast.dmouseY;
	screenControl.move(deltaX,deltaY);
}
function mouseWheel(event)
{
	var newZoom=screenControl.zoom+0.001*event.delta;
	screenControl.scale(newZoom,mouseX,mouseY);
}
function changer()
{
	field.makeField(rowSlider.value, colSlider.value);
	screenControl.set(field.w,field.h);
}

function roundedHexagon(x,y,r)
{
	beginShape();
	roundedHexagonRaw(x,y,r);
	endShape(CLOSE);
}
function roundedHexagonRaw(x,y,r)
{
	var edge=createVector(0,r*cos(PI/6));
	var cpoint=createVector(-r/2,0);
	var apoint=createVector(-r*7/20,0);
	var v1, v2;
	v2=p5.Vector.add(edge,apoint);
	vertex(x+v2.x,y+v2.y);
	for(var i=0;i<6;i++)
	{
		v1=p5.Vector.sub(edge,cpoint);
		v2=p5.Vector.sub(edge,apoint);
		bezierVertex(x+v1.x,y+v1.y,x+v2.x,y+v2.y,x+v2.x,y+v2.y);
		v1=p5.Vector.add(edge,cpoint);
		v2=p5.Vector.add(edge,apoint);
		bezierVertex(x+v2.x,y+v2.y,x+v1.x,y+v1.y,x+v2.x,y+v2.y);
		edge.rotate(PI/3);
		cpoint.rotate(PI/3);
		apoint.rotate(PI/3);
	}
	v1=p5.Vector.sub(edge,cpoint);
	v2=p5.Vector.sub(edge,apoint);
	bezierVertex(x+v1.x,y+v1.y,x+v2.x,y+v2.y,x+v2.x,y+v2.y);
}

function detectCell(kind)
{
	switch(kind)
	{
		case 3:
		case 4:return _FILLER;
		case 1:return _MOVEABLE;
		default:return _NOMOVE;
	}
}

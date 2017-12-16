var screenControl;	//class that control screen
var inputBroadcast;	//user-input varient class
var field=null;
var kind=1;
var who=1;
var enemy=false;
var rowSlider;
var colSlider;
var sliderPressed=false;

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
	rowSlider.mousePressed(function(){sliderPressed=true;});
	rowSlider.mouseReleased(function(){sliderPressed=false;});
	colSlider = createSlider(0, 50, 10, 1);
 	colSlider.position(10, 40);
	colSlider.mousePressed(function(){sliderPressed=true;});
	colSlider.mouseReleased(function(){sliderPressed=false;});
}
function draw()
{
	inputBroadcast.renew();
	if(inputBroadcast.isMousePress)
	{
		var clickSignal;
		clickSignal=field.clickCheck();
		if(clickSignal!==null)
		{
			field.cells[clickSignal.index.row][clickSignal.index.col].kind=kind;
			field.cells[clickSignal.index.row][clickSignal.index.col].who=who;
			field.cells[clickSignal.index.row][clickSignal.index.col].enemy=enemy;
		}
	}
	if(mouseIsPressed&&sliderPressed) changer();
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
function keyPressed()
{
	switch(key)
	{
		case '`':kind=0; who=-1; break;
		case '1':kind=1; break;
		case '2':kind=2; break;
		case '3':kind=3; break;
		case '4':kind=4; break;
		case '5':kind=5; who=-1; break;
/*		case '6':kind=6; break;
		case '7':kind=7; break;
		case '8':kind=8; break;
		case '9':kind=9; break;
		case '0':kind=10; break;
		case 'Q':
		case 'q':kind=11; break;
		case 'W':
		case 'w':kind=12; break;
		case 'E':
		case 'e':kind=13; break;
		case 'R':
		case 'r':kind=14; break;
		case 'T':
		case 't':kind=15; break;
		case 'Y':
		case 'y':kind=16; break;*/
		case 'Z':
		case 'z':who=1; break;
		case 'X':
		case 'x':who=2; break;
		case 'C':
		case 'c':who=0; break;
		case 'V':
		case 'v':enemy=!enemy; break;
	}
}
function changer()
{
	console.log(field);
	field.makeField(rowSlider.value(), colSlider.value());
	console.log(field);
	screenControl.set(field.w,field.h);
	screenControl.scale(0.0001,width/2,height/2);
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

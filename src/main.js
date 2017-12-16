var screenControl;	//class that control screen
var inputBroadcast;	//user-input varient class
var field=null;
var kind;
var who;
var rowSlider;
var colSlider;

function setup()
{
	createCanvas(windowWidth,windowHeight);
	inputBroadcast=new BROADCAST();
	screenControl=new SCREEN_CONTROL(width,height);
	field=new FIELD();
	field.makeField();
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

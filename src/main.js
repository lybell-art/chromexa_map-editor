var screenControl;	//class that control screen
var inputBroadcast;	//user-input varient class
var field=null;
var kind=1;
var who=1;
var enemy=false;
var rowSlider, colSlider;
var rowInput, colInput;
var sliderPressed=false;
var saveButton;

function setup()
{
	createCanvas(windowWidth,windowHeight);
	inputBroadcast=new BROADCAST();
	screenControl=new SCREEN_CONTROL(width,height);
	field=new FIELD();
	field.makeField(10,10);
	screenControl.set(this.field.w,this.field.h);
	rowSlider = createSlider(1, 50, 10, 1);
 	rowSlider.position(10, 10);
	rowSlider.mousePressed(function(){sliderPressed=true;});
	rowSlider.mouseReleased(function(){sliderPressed=false;});
	rowInput=createInput('');
	rowInput.position(10+rowSlider.width,10);
	rowInput.size(50,20);
	rowInput.input(function(){rowSlider.value(rowInput.value()); changer();});
	colSlider = createSlider(1, 50, 10, 1);
 	colSlider.position(10, 40);
	colSlider.mousePressed(function(){sliderPressed=true;});
	colSlider.mouseReleased(function(){sliderPressed=false;});
	colInput=createInput('');
	colInput.position(10+colSlider.width,40);
	colInput.size(50,20);
	colInput.input(function(){colSlider.value(colInput.value()); changer();});
	saveButton=createButton('SAVE');
	saveButton.position(width-saveButton.width,0);
	saveButton.mousePressed(exportMap);
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
			var thisCell=field.cells[clickSignal.index.row][clickSignal.index.col];
			if(enemy)
			{
				thisCell.enemy=!thisCell.enemy;
			}
			else
			{
				thisCell.kind=kind;
				switch(who)
				{
					case 0:
					case 5:thisCell.who=-1;
					default:thisCell.who=who;
				}
			}
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
	switch(keyCode)
	{
		case 192:kind=0; break;		//`
		case 49:kind=1; break;		//1
		case 50:kind=2; break;		//2
		case 51:kind=3; break;		//3
		case 52:kind=4; break;		//4
		case 53:kind=5; break;		//5
/*		case 54:kind=6; break;		//6
		case 55:kind=7; break;		//7
		case 56:kind=8; break;		//8
		case 57:kind=9; break;		//9
		case 48:kind=10; break;		//0
		case 81:kind=11; break;		//q
		case 87:kind=12; break;		//w
		case 69:kind=13; break;		//e
		case 82:kind=14; break;		//r
		case 84:kind=15; break;		//t
		case 89:kind=16; break;*/	//y
		case 90:who=1; break;		//z
		case 88:who=2; break;		//x
		case 67:who=0; break;		//c
		case 86:enemy=!enemy; break;	//v
	}
}
function changer()
{
	field.makeField(rowSlider.value(), colSlider.value());
	screenControl.set(field.w,field.h);
	screenControl.scale(0.0001,width/2,height/2);
}
function exportMap()
{
	var i,j;
	var datum=function(cell)
	{
		var kind=cell.kind;
		var who=cell.who;
		var enemy=cell.enemy;
		var enemyCode=null;
		if(enemy) enemyCode=1001;
		return kind+"|"+who+"|"+enemyCode;
	};
	var table=new p5.Table();
	for(i=0;i<field.Rows;i++) table.addRow();
	for(i=0;i<field.Columns;i++) table.addColumn();
	for(i=0;i<field.Rows;i++)
	{
		for(j=0;j<field.Columns;j++)
		{
			table.set(i,j,datum(field.cells[i][j]));
		}
	}
	saveTable(table,"map.csv");
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

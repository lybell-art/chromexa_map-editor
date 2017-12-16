/**
 *
 * 필드 클래스
 * 
 * @author steliviere
 * @date 2017.12.15
 * @version 0.15
 *
 */
function FIELD()
{
  /**
   *
   * @var {int} Rows		필드의 행(가로줄)의 수
   * @var {int} Columns		필드의 열(세로줄)의 수
   * @var {float} w		필드의 가로 길이
   * @var {float} h		필드의 세로 길이
   * @var {object|CELL} cells	셀 오브젝트
   *
   */
	this.Rows=0;
	this.Columns=0;
	this.w=0;
	this.h=0;
	this.cells=new Array(100);
	for(var i=0;i<100;i++) this.cells[i]=new Array(100);
	for(var i=0;i<100;i++)
	{
		this.cells[i]=new Array(100);
		for(var j=0;j<100;j++)
		{
			this.cells[i][j]=new CELL(i,j,2,0);
		}
	}
}
/**
 *
 * 맵의 데이터를 불러와 필드를 생성
 *
 * @param {object|MAP_DATA} mapData	resourceBox 클래스에 저장된 맵의 데이터
 *
 */
FIELD.prototype.makeField=function(row, col)
{
	/* 미구현
	var mapData_kind=mapData.kind;
	var mapData_who=mapData.who;
	this.Rows=mapData.row;
	this.Columns=mapData.column;
	*/
	this.Rows=row;
	this.Columns=col;
	this.w=45*(1.5*this.Columns+0.5);
	this.h=45*cos(PI/6)*(2*this.Rows+1);
}
/**
 *
 * 필드를 화면에 출력
 *
 */
FIELD.prototype.draw=function()
{
	for(var i=0;i<this.Rows;i++)
	{
		for(var j=0;j<this.Columns;j++)
		{
			this.cells[i][j].draw();
		}
	}
}
/**
 *
 * 각 셀마다 클릭 여부를 체크, 클릭한 셀의 인덱스 no와 셀의 유형을 리턴한다.
 *
 * @return {COORD}	메인 함수에 전달할 값들
 			index:자신의 인덱스 no.
			signal:버튼 종류(0:움직일 수 없는 셀, 1:움직일 수 있는 셀, 2:필러)
			없을 시 null 반환
 *
 */
FIELD.prototype.clickCheck=function()
{
	for(var i=0;i<this.Rows;i++)
	{
		for(var j=0;j<this.Columns;j++)
		{
			if(this.cells[i][j].isMouseOn())
			{
				return this.cells[i][j].mouseClick();
			}
		}
	}
	return null;
}


// 색깔값
const COLOR_DEFAULT = '#ffffffff';
const COLOR_NODE_DEFAULT = '#444444aa';
const COLOR_LINE_DEFAULT = '#ffffffff';
const COLOR_NODE_TO_NODE = '#999999';
const COLOR_NODE_BORDER = '#333';
const COLOR_NODE_OUTER = '#fff';
const COLOR_NODE_OUTER_BORDER = '#888';
const COLOR_NODE_TEXT = '#fff';

const COLOR_GATEWAY_DEFAULT = '#444444aa'
const COLOR_GATEWAY_1 = '#03c1a1';
const COLOR_GATEWAY_2 = '#7200da';
const COLOR_GATEWAY_3 = '#e53a40';

const COLOR_GATEWAY_BORDER = '#333';
const COLOR_GATEWAY_OUTER = '#fff';
const COLOR_GATEWAY_OUTER_BORDER = '#888'
const COLOR_GATEWAY_TEXT = '#fff';

const COLOR_DATAMOVE_CIRCLE = 'RGB(100,100,100)';//'RGB(230,133,35)';
const COLOR_DATAMOVE_ROUTER = '#ee7f00';

// 도화지 사이즈
const DRAW_SIZE_X = 1900;
const DRAW_SIZE_Y = 1060;

// 게이트웨이 사이즈
const GATEWAY_SIZE_X = 120;
const GATEWAY_SIZE_Y = 90;
const GATEWAY_EDGE_RADIUS = 20;

const GATEWAY_OUTER_EDGE_RADIUS = 20;
const GATEWAY_OUTER_SIZE_DELTA_X = 8
const GATEWAY_OUTER_SIZE_DELTA_Y = 8

// 노드 원의 지름
const NODE_DIAMETER = 50;
const NODE_OUTER_DIAMETER_DELTA = 5;

// 마우스 트레이스 두께
const MOUSE_TRACE_WIDTH = 1.5;


// 데이터 움직이는 애니메이션 설정

const DATAMOVE_ANIMATION_DURATION = 2500;
const DATAMOVE_ANIMATION_DELAY = 100;
const DATAMOVE_ANIMATION_DELAY_DELTA = 1000;
const DATAMOVE_CIRCLE_DIAMETER = 10;
const DATAMOVE_NUMBER = 1;

// AP 1개의 노드 개수
const NODE_PER_GATEWAY = 64;

// 멀티보드 1개의 노드 개수
const NODE_PER_BOARD = 32;

const draw = SVG('Topology').size(DRAW_SIZE_X, DRAW_SIZE_Y);

var gateways = new Array();
var gatewayOuters = new Array();
var gatewayTexts = new Array();
var gatewayColors = new Array();


var nodes = new Array();
var nodeOuters = new Array();
var nodeLines = new Array();
var nodeTexts = new Array();
var nodeStatus = new Array();

var dataCircles = new Array() ;

var selectedNodeIndex;
var selectedGatewayIndex;

var isNodeSelect = false;

//////////////////////////////////////////////////////////////
//간격 조정
//AP
var gwX = 625; // x 좌표
var gwY = 540; // y 좌표
var gwXGap = 320; // x AP1<->AP2 간격
var gwXGap2 = 320; // x AP2<->AP3 간격


//Node
var ndX = 120;	// x 좌표
var ndY = 100; // y좌표

var ndXGap = 60;	// Node<->Node
var ndXAPGap = 650; // Multiboard1 <-> Multiboard2
var ndXAPGap2 = 650; // Multiboard2 <-> Multiboard3
var ndYGap = 350;

//Contoller

var mb1 = new Array()
var mb2 = new Array()
var mb3 = new Array()
var mb4 = new Array()
var mb5 = new Array()
var mb6 = new Array()

// 게이트웨이 & 노드의 위치는 center(x,y) 중심점 기준.
gateways[0] = draw.rect(GATEWAY_SIZE_X,GATEWAY_SIZE_Y).center(gwX, gwY).id('AP1');
gateways[1] = draw.rect(GATEWAY_SIZE_X,GATEWAY_SIZE_Y).center(gwX+gwXGap, gwY).id('AP2');
gateways[2] = draw.rect(GATEWAY_SIZE_X,GATEWAY_SIZE_Y).center(gwX+gwXGap+gwXGap2, gwY).id('AP3');

// 게이트웨이 별 색상.
gatewayColors[0]=COLOR_GATEWAY_1;
gatewayColors[1]=COLOR_GATEWAY_2;
gatewayColors[2]=COLOR_GATEWAY_3;


var l=0;
///////////////////////////////////////////////////////////////////////////////////////////////////
// Multiboard1
var j=0;
for(var row=0 ; row<4 ; row++) {
	for(var col=0; col<8; col++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndX+col*ndXGap, ndY+row*(NODE_DIAMETER+30)).id('MB1N'+(j++));
		
	}
}

for(var row=0 ; row<4 ; row++) {
	for(var col=0; col<8; col++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndX+col*ndXGap, ndY+row*(NODE_DIAMETER+30)).id('MB1N'+(j++));
		
	}
}
/*
for(var i=4 ; i<8 ; i++) {
	for(var k=0; k<8; k++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndX+k*ndXGap, ndY+ndYGap+(i+1)*(NODE_DIAMETER+30)).id('MB1N'+(j++));
		
	}
}
*/
///////////////////////////////////////////////////////////////////////////////////////////////////
// Multiboard2
j=0;

for(var row=0 ; row<4 ; row++) {
	for(var col=0; col<8; col++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndX+col*ndXGap, ndY+row*(NODE_DIAMETER+30)).id('MB2N'+(j++));
		
	}
}

for(var row=0 ; row<4 ; row++) {
	for(var col=0; col<8; col++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndX+col*ndXGap, ndY+row*(NODE_DIAMETER+30)).id('MB2N'+(j++));
		
	}
}

/*
for(var i=8 ; i<12 ; i++) {
	for(var k=0; k<8; k++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndXAPGap+ndX+k*ndXGap, ndY+(i-8)*(NODE_DIAMETER+30)).id('MB2N'+(j++));
		
	}
}
for(var i=12 ; i<16 ; i++) {
	for(var k=0; k<8; k++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndXAPGap+ndX+k*ndXGap, ndY+ndYGap+(i-7)*(NODE_DIAMETER+30)).id('MB2N'+(j++));
		
	}
}
*/
///////////////////////////////////////////////////////////////////////////////////////////////////
// Multiboard3
j=0;

for(var row=0 ; row<4 ; row++) {
	for(var col=0; col<8; col++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndX+col*ndXGap, ndY+row*(NODE_DIAMETER+30)).id('MB3N'+(j++));
		
	}
}

for(var row=0 ; row<4 ; row++) {
	for(var col=0; col<8; col++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndX+col*ndXGap, ndY+row*(NODE_DIAMETER+30)).id('MB3N'+(j++));
		
	}
}
/*
for(var i=16 ; i<20 ; i++) {
	for(var k=0; k<8; k++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndXAPGap+ndXAPGap2+ndX+k*ndXGap, ndY+(i-16.05)*(NODE_DIAMETER+30)).id('MB3N'+(j++));
		
	}
}
for(var i=20 ; i<24 ; i++) {
	for(var k=0; k<8; k++) {
		nodes[l++] = draw.circle(NODE_DIAMETER).center(ndXAPGap+ndXAPGap2+ndX+k*ndXGap, ndY+ndYGap+(i-15.05)*(NODE_DIAMETER+30)).id('MB3N'+(j++));
		
	}
}
*/
for(var i=0; i<NODE_PER_BOARD; i++) {
	mb1[i] = nodes[NODE_PER_BOARD*0 + i];
	mb2[i] = nodes[NODE_PER_BOARD*1 + i];
	mb3[i] = nodes[NODE_PER_BOARD*2 + i];
	mb4[i] = nodes[NODE_PER_BOARD*3 + i];
	mb5[i] = nodes[NODE_PER_BOARD*4 + i];
	mb6[i] = nodes[NODE_PER_BOARD*5 + i];
}

moveMultiboard(mb1, 0, 0);
moveMultiboard(mb2, 650, 0);
moveMultiboard(mb3, 1250, 0);
moveMultiboard(mb4, 0, 620);
moveMultiboard(mb5, 650, 620);
moveMultiboard(mb6, 9999, 9999);


var mouseTraceLine = draw.line(0,0,0,0).stroke({ width: MOUSE_TRACE_WIDTH });

// Config nodes and gateways
for(var i=0; i<gateways.length; i++){
	setObjectColor(gateways[i], COLOR_DEFAULT);
}
for(var i=0; i<nodes.length; i++){
	setObjectColor(nodes[i], "#ffff00");
}

// Gateways Border Config
gateways.forEach(function (elements)
{
	elements.radius(GATEWAY_EDGE_RADIUS);
	setLineColor(elements, COLOR_DEFAULT );
});

// Gateway Outers Config
for(var i = 0 ; i < gateways.length; i++)
{
	gatewayOuters[i] = draw.rect(gateways[i].attr('width') + GATEWAY_OUTER_SIZE_DELTA_X , gateways[i].attr('height') + GATEWAY_OUTER_SIZE_DELTA_Y )
	.center(gateways[i].cx(),gateways[i].cy()).radius(GATEWAY_OUTER_EDGE_RADIUS).fill(COLOR_GATEWAY_OUTER);

	setLineColor(gatewayOuters[i], COLOR_DEFAULT);
	gatewayOuters[i].back(gateways[i]);
}

// Nodes Border Config
nodes.forEach(function( elements )
{
	setLineColor(elements, COLOR_DEFAULT);		
});

// Node Outers Config
for(var i = 0 ; i < nodes.length; i++)
{
	nodeOuters[i] = draw.circle(nodes[i].attr('r') * 2 + NODE_OUTER_DIAMETER_DELTA ).center(nodes[i].cx(),nodes[i].cy()).fill(COLOR_NODE_OUTER);
	setLineColor(nodeOuters[i], COLOR_DEFAULT);
	nodeOuters[i].back(nodes[i]);
}

//Node Texts Config
for(var i = 0; i < nodes.length ; i++){
	// nodeTexts[i] = -1;
	nodeTexts[i] = setObjectText( draw, nodes[i], "");
	nodeTexts[i].fill(COLOR_DEFAULT);
}


// Gateway Texts Config
for(var i = 0; i < gateways.length; i++)
{
	
	gatewayTexts[i] = setObjectText( draw, gateways[i], "AP"+(i+1)  );
	gatewayTexts[i].fill(COLOR_GATEWAY_TEXT);
	
}
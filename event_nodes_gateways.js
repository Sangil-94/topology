

// Events

gateways.forEach(function(elements)
{
	elements.click(function(e)
	{
		clickGateway(elements);

	});
});


nodes.forEach(function(elements,index)
{
	elements.click(function()
	{
		clickNode(elements);
	});
});

// function action_click(event){
// 	if(isGatewaySelect==false)
// 		return;

// 	var cx1 = gateways[selectedGatewayIndex].cx();
// 	var cy1 = gateways[selectedGatewayIndex].cy();
// 	console.log(cx1 + " " + cy1);

// 	var x1 = event.clientX;
// 	var y1 = event.clientY;

// 	console.log(x1 + " " + y1);
// 	gateways[selectedGatewayIndex].center(x1,y1);
// 	isGatewaySelect=false;
// }

// draw.on('mousemove',function(e)
// {
// 	if( isNodeSelect == false )
// 		return;
	
// 	if (mouseTraceLine.attr('x1') == 0 && mouseTraceLine.attr('y1') == 0 )
// 		return;

// 	mouseTraceLine.attr({'x2' : e.pageX, 'y2' : e.pageY});
// });

draw.on('mousedown',function(e)
{
	if (isNodeSelect == false)
		return ;

	if (mouseTraceLine.attr('x1') == 0 && mouseTraceLine.attr('y1') == 0 )
		return ;

	// 게이트웨이,노드 가 아닌 곳을 클릭했는지 체크
	if ( e.path[0].id != 'gatewayID' || e.path[0].id != 'nodeID' )
		return;

	stopMouseTracing(mouseTraceLine);
	isNodeSelect = false;
	

});

// 수정 : 마우스 트래킹 버그 수정
draw.on('mousemove',function(e)
{
	if( isNodeSelect == false )
		return;
	
	if (mouseTraceLine.attr('x1') == 0 && mouseTraceLine.attr('y1') == 0 )
		return;

	mouseTraceLine.attr({'x2' : e.offsetX, 'y2' : e.offsetY});
});

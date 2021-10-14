

function drawLine(svgObject, figureObject1, figureObject2)
{
	var line = svgObject.line(figureObject1.cx(), figureObject1.cy(), figureObject2.cx(), figureObject2.cy()).stroke({ width: 1 }).id('nodeLineID');
	line.back( gateways[selectedGatewayIndex] );
	return line;
}

function setObjectColor( rectObject, inputColor)
{
	if(rectObject.fill() == inputColor) {
		return;
	}

	rectObject.fill({color : inputColor });
}

function setLineColor( lineObject, inputColor)
{
	if(lineObject.stroke() == inputColor) {
		return;
	}

	lineObject.stroke({color : inputColor });
}


function clickNode(nodeObject)
{
	// First Click Node
	if( isNodeSelect == false )
	{
		selectedNodeIndex = nodes.indexOf(nodeObject);
		isNodeSelect = true;
		
		//mouseTraceLine.attr({'x1' : nodes[ selectedNodeIndex ].cx(),'y1': nodes[ selectedNodeIndex ].cy(),'x2' : nodes[ selectedNodeIndex ].cx(),'y2': nodes[ selectedNodeIndex ].cy()});
		
		stopDataMoveAnimation(selectedNodeIndex);
		
		if( nodeLines[selectedNodeIndex] != null) 
		{
			nodeLines[selectedNodeIndex].remove();
			setObjectColor( nodes[selectedNodeIndex] , COLOR_NODE_DEFAULT );
		}
	}
	// Second Click Node (Link node to node)
	else if (isNodeSelect == true) 
	{
		index2 = nodes.indexOf(nodeObject);
		setNodeToNodeLink(selectedNodeIndex, index2);
		stopMouseTracing(mouseTraceLine);
		isNodeSelect = false;
	} 
	
}

function clickGateway(gatewayObject)
{
	if(isNodeSelect == false ){
		// selectedGatewayIndex = gateways.indexOf(gatewayObject);
		// isGatewaySelect = true;
		return;
	}

	selectedGatewayIndex = gateways.indexOf(gatewayObject);
	setNodeToGatewayLink(selectedNodeIndex, selectedGatewayIndex);
}


function setNodeToNodeLink(srcNodeIndex, dstNodeIndex, gatewayIndex)
{
	if( nodeLines[srcNodeIndex] != null)
		return;
		// removeLine(srcNodeIndex);


	nodeLines[srcNodeIndex] = drawLine(draw, nodes[srcNodeIndex], nodes[dstNodeIndex]);

	setLineColor(nodeLines[ srcNodeIndex ], gatewayColors[gatewayIndex]);

	setObjectColor(nodes[ srcNodeIndex ], gatewayColors[gatewayIndex]);

	setDataMoveAnimation(nodes[srcNodeIndex], nodes[dstNodeIndex]);

}

function setGatewayToGatewayLink(srcGatewayIndex, dstGatewayIndex)
{
	if( nodeLines[7+srcGatewayIndex] != null)
		return;
		// removeLine(srcGatewayIndex);


	nodeLines[7+srcGatewayIndex] = drawLine(draw, gateways[srcGatewayIndex], gateways[dstGatewayIndex]);
	setLineColor(nodeLines[7+srcGatewayIndex ], COLOR_GATEWAY_6);
	setObjectColor(gateways[ srcGatewayIndex ], COLOR_GATEWAY_6);

	setDataMoveAnimation(gateways[srcGatewayIndex], gateways[dstGatewayIndex], "router");
}

function setNodeToGatewayLink(inputNodeIndex, inputGatewayIndex)
{
	if( nodeLines[inputNodeIndex] != null) {
		if(nodeLines[inputNodeIndex].inputNodeIndex==inputNodeIndex
			&& nodeLines[inputNodeIndex].inputGatewayIndex == inputGatewayIndex) {
			// same
			return;
		}

		removeLine(inputNodeIndex);
	}
	

	isNodeSelect = false;
	stopMouseTracing(mouseTraceLine);

	//Link node & gateway
	nodeLines[inputNodeIndex] =  drawLine(draw, nodes[inputNodeIndex], gateways[inputGatewayIndex]);
	
	setLineColor(nodeLines[ inputNodeIndex ], gatewayColors[inputGatewayIndex]);
	setObjectColor(nodes[ inputNodeIndex ], gatewayColors[inputGatewayIndex]);

	setDataMoveAnimation(nodes[inputNodeIndex], gateways[inputGatewayIndex], "normal");
    
	nodeLines[inputNodeIndex].inputNodeIndex = inputNodeIndex;
	nodeLines[inputNodeIndex].inputGatewayIndex = inputGatewayIndex;

	nodeTexts[inputNodeIndex].front();
	nodeLines[inputNodeIndex].front();
}

function stopDataMoveAnimation(srcNodeIndex)
{
	if( dataCircles[srcNodeIndex] != null)
	{
		dataCircles[srcNodeIndex].forEach(function (elements)
		{
			elements.remove();
		});
	}
}

function setDataMoveAnimation(srcObject, dstObject, type)
{
	var srcNodeIndex = nodes.indexOf(srcObject);

	stopDataMoveAnimation(srcNodeIndex);

	var circles = new Array();
	
	// nodeLines[srcNodeIndex].front();

    for (var i = 0 ; i < DATAMOVE_NUMBER ; i++)
    {
		if(type=="normal") {
			circles[i] = draw.circle(DATAMOVE_CIRCLE_DIAMETER).center( srcObject.cx(), srcObject.cy() ).fill({color : COLOR_DATAMOVE_CIRCLE});
		} else {
			circles[i] = draw.circle(DATAMOVE_CIRCLE_DIAMETER).center( srcObject.cx(), srcObject.cy() ).fill({color : COLOR_DATAMOVE_ROUTER});
		}

       	var delay = DATAMOVE_ANIMATION_DELAY + (DATAMOVE_ANIMATION_DELAY_DELTA * i)
       	var duration = DATAMOVE_ANIMATION_DURATION;

       	// animate ( duration , ease type, delay )
		circles[i].animate(duration,"-",delay).center( dstObject.cx() , dstObject.cy() ).loop();

		circles[i].after( dstObject );

    }
    
	dataCircles[srcNodeIndex] = circles;
	// nodeLines[srcNodeIndex].before(dstObject);

}

function setObjectText( svgObject, inputObject, inputText, OFFSET_X , OFFSET_Y )
{
	if(svgObject.text() != "" && svgObject.text() == inputText) {
		return;
	}

	if(OFFSET_X === undefined) 
		OFFSET_X = 0;

	if(OFFSET_Y === undefined) 
		OFFSET_Y = 0;

	var text = svgObject.text(inputText);
	text.center(inputObject.cx() + OFFSET_X, inputObject.cy()) + OFFSET_Y;

	return text;
}	

function stopMouseTracing(inputMouseTraceLine)
{
	inputMouseTraceLine.attr({'x1' : 0,'y1': 0,'x2' : 0,'y2': 0});
}

function removeLine(nodeIndex)
{
	stopDataMoveAnimation(nodeIndex);
	nodeLines[nodeIndex].remove();
	nodeLines[nodeIndex] = null;
	setObjectColor( nodes[nodeIndex] , COLOR_NODE_DEFAULT );
}

function removeAllLine()
{
	for (var i = 0 ; i < nodeLines.length ; i++)
	{
		removeLine(i);
	}
}

function moveMultiboard(multiboard, x, y)
{
	for(var i=0; i<NODE_PER_BOARD; i++) {
		multiboard[i].center(multiboard[i].cx()+x, multiboard[i].cy()+y);
	}
}
const RELOAD_TIME_INTERVAL = 3*1000;	// msec

const NODE_DEFAULT = -1;
const NODE_DONE = 1;

const NODE_AIR = 0;
const NODE_CBR = 1;

const ONE_HOP = 0;
const MULTI_HOP = 1;

const DEVICETYPE_PNC = 0;
const DEVICETYPE_ROUTER = 1;
const DEVICETYPE_NODE = 2;

var Cluster = {};
var NodeInfo = [];

$(document).ready(function() {
	
	init_var();

	reloadData();
	
	$('#btn_reload').click(function(e) {
		location.reload();
	});

} );

function init_var() {

	for(var i=0; i<gateways.length; i++) {

		Cluster[i]= 
		{
			AP : {
				PanID : 0,
				ShortID : 0,
				},
		}
	}

	Cluster[0].AP.PanID = 32769;
	Cluster[1].AP.PanID = 36865;
	Cluster[2].AP.PanID = 40961;

	for(var i=0; i<nodes.length; i++) {

		NodeInfo[i]=
		{
			Node : {
				Idx : -1,
				PanID : -1,
				ShortID : -1,
				ParentShortID : -1,
				DeviceType : -1,
				dt_nrr : '0000-00-00 00:00:00',
				dt_air : '0000-00-00 00:00:00',
				dt_cbr : '0000-00-00 00:00:00'
			},

			UI_Node : {
				PanIndex : -1,
				NodeIndex : -1,
				RouterIndex : -1,
			},
			
			Status : NODE_DEFAULT
		}
	}

}

function Check_Pan() {

	$("body").css("cursor", "progress");

	$.ajax({
		method: "POST",
		url: 'mysql_nodes_gateways_script.php',
		data: {	
			mode:"select_pan",
		},
	}).done(function(data){

		var json =  $.parseJSON(data);
		
		$.each(json, function(idx, obj) {
			
			for(var i=0; i<gateways.length ; i++){

				if(Cluster[i].AP.PanID == parseInt(obj.panid)){

					Cluster[i].AP.ShortID = parseInt(obj.shortid);
				}

			}
			
		});

		$("body").css("cursor", "default");
	}).fail(function(jqXHR, textStatus){
		$("body").css("cursor", "default");
		alert("Check_Pan() Fail : "+textStatus);
	});

}

function Get_NodeInfo() {

	$("body").css("cursor", "progress");
	$.ajax({
		method : "POST",
		url : 'mysql_nodes_gateways_script.php',
		data : {
			mode : "select_nodeinfo",
		},
	}).done(function(data){

		var json = $.parseJSON(data);
		
		$.each(json, function(idx, obj){

			var node = NodeInfo[idx];

			if(node.Node.dt_cbr != "0000-00-00 00:00:00") {
				return true;
			} 
			
			Set_NodeInfo(node, obj, idx);

		});

		$("body").css("cursor", "default");

	}).fail(function(jqXHR, textStatus){

		$("body").css("cursor", "default");
		
		alert("Fail : " + textStatus);
	});
	
}

function Set_NodeInfo(node, obj, idx) {

	switch (parseInt(obj.panid)) {

		case Cluster[0].AP.PanID:
		
			node.UI_Node.PanIndex = 0;

			break;

		case Cluster[1].AP.PanID:
			
			node.UI_Node.PanIndex = 1;
			
			break;

		case Cluster[2].AP.PanID:
			
			node.UI_Node.PanIndex = 2;
			
			break;

		default:
			
			return;

	}

	node.Node.Idx = parseInt(obj.idx);

	if(node.Node.Idx > 0){
		Calculate_NodeIdx(idx);
	}

	node.Node.PanID = parseInt(obj.panid);
	node.Node.ShortID = parseInt(obj.shortid);
	node.Node.ParentShortID = parseInt(obj.parentshortid);
	node.Node.DeviceType = parseInt(obj.devicetype);

	if(node.Node.ParentShortID > 0){
		Get_RouterIdx(idx, parseInt(obj.parentshortid), parseInt(obj.panid));
	}

	node.Node.dt_nrr = obj['dt_nrr'];
	node.Node.dt_air = obj['dt_air'];
	node.Node.dt_cbr = obj['dt_cbr'];
}

function Calculate_NodeIdx(index) {

	$("body").css("cursor", "progress");

	$.ajax({
		method : "POST",
		url : 'mysql_nodes_gateways_script.php',
		data : {
			mode : "select_nodeIndex",
			my_idx : NodeInfo[index].Node.Idx,
		},
	}).done(function(data){
		// console.log('Calculate_NodeIdx() Response : ', data);
		var json = $.parseJSON(data);

		$.each(json, function(idx, obj){
			NodeInfo[index].UI_Node.NodeIndex = parseInt(obj.idx);
		});

		$("body").css("cursor", "default");

	}).fail(function(jqXHR, textStatus){

		$("body").css("cursor", "default");
		
		alert("Fail : " + textStatus);
	});
	
}

function Calculate_RouterIdx(index, routerIdx) {


	$("body").css("cursor", "progress");

	$.ajax({
		method : "POST",
		url : 'mysql_nodes_gateways_script.php',
		data : {
			mode : "select_nodeIndex",
			my_idx : routerIdx,
		},
	}).done(function(data){
		// console.log('Calculate_NodeIdx() Response : ', data);
		var json = $.parseJSON(data);

		$.each(json, function(idx, obj){
			NodeInfo[index].UI_Node.RouterIndex = parseInt(obj.idx);
		});

		$("body").css("cursor", "default");
	}).fail(function(jqXHR, textStatus){

		$("body").css("cursor", "default");
		
		alert("Fail : " + textStatus);
	});

}

function Get_RouterIdx(index, parentshortid, panid) {

	if(NodeInfo[index].UI_Node.RouterIndex > 0){
		return;
	}

	$("body").css("cursor", "default");

	$.ajax({
		method : "POST",
		url : 'mysql_nodes_gateways_script.php',
		data : {
			mode : "select_router",
			router_shortid : parentshortid,
			panid : panid,
		},
	}).done(function(data){

		var json = $.parseJSON(data);

		$.each(json, function(idx, obj){

		Calculate_RouterIdx(index, parseInt(obj.idx));

	});
		$("body").css("cursor", "default");
	}).fail(function(jqXHR, textStatus){
		$("body").css("cursor", "default");
		alert("Fail : " + textStatus);
	});
	
}

function Get_NodeCount() {
	$.ajax({
		method : "POST",
		url : 'mysql_nodes_gateways_script.php',
		data : {
			mode : "hop_count",
			pan1 : Cluster[0].AP.PanID,
			pan2 : Cluster[1].AP.PanID,
			pan3 : Cluster[2].AP.PanID
		},
	}).done(function(data) {
		var json = $.parseJSON(data);

		
		$.each(json, function(idx, obj){
			document.getElementById("hop").innerText = obj["hop"] + "개";
			document.getElementById("1hop").innerText = obj["1hop"] + "개";
			document.getElementById("2hop").innerText = obj["2hop"] + "개";
			document.getElementById("3hop").innerText = obj["3hop"] + "개";
			document.getElementById("pan1").innerText = obj["pan1"] + "개";
			document.getElementById("pan2").innerText = obj["pan2"] + "개";
			document.getElementById("pan3").innerText = obj["pan3"] + "개";
		});
	});
}

function Update_UI_Node() {
		
	for(var i=0; i < nodes.length; i++){

		var node = NodeInfo[i];

		//console.log(node.Status + ", " + node.Node.dt_nrr+ ", " + node.Node.dt_air+ ", " + node.Node.dt_cbr);

		if(node.Status == NODE_DONE){
			continue;
		}

		if (node.Node.dt_nrr > "0000-00-00 00:00:00") {
			changeNodeBorderColorStatus(node.UI_Node.NodeIndex);
			changeNodeBkgColorStatus(node.UI_Node.NodeIndex, node.UI_Node.PanIndex);

			if(nodeTexts[i].text() == "") {
				nodeTexts[i] = setObjectText( draw, nodes[node.UI_Node.NodeIndex], "" + node.Node.ShortID);
				nodeTexts[i].fill(COLOR_DEFAULT);
				nodeTexts[i].front();
			}
			
			if(node.Node.DeviceType == DEVICETYPE_ROUTER) {
				if(node.Node.ParentShortID > 0) {
					setNodeToNodeLink(node.UI_Node.NodeIndex, node.UI_Node.RouterIndex, node.UI_Node.PanIndex);
					nodeTexts[node.UI_Node.RouterIndex].front();
					gatewayTexts[node.UI_Node.PanIndex].front();
				} else if(node.Node.ParentShortID == 0) {
					setNodeToGatewayLink(node.UI_Node.NodeIndex, node.UI_Node.PanIndex);
					gatewayTexts[node.UI_Node.PanIndex].front();
				}
			}
		}

		if (node.Node.dt_air > "0000-00-00 00:00:00") {
			//2-Hop Check
			if(node.Node.ParentShortID > 0) {
				setNodeToNodeLink(node.UI_Node.NodeIndex, node.UI_Node.RouterIndex, node.UI_Node.PanIndex);
				nodeTexts[node.UI_Node.RouterIndex].front();
				gatewayTexts[node.UI_Node.PanIndex].front();
			}else{
				setNodeToGatewayLink(node.UI_Node.NodeIndex, node.UI_Node.PanIndex);
				gatewayTexts[node.UI_Node.PanIndex].front();
			}
		}

		if (node.Node.dt_cbr > "0000-00-00 00:00:00") {
			//2-Hop Check
			if(node.Node.ParentShortID > 0) {
				//setNodeToNodeLink(node.UI_Node.NodeIndex, node.UI_Node.RouterIndex, node.UI_Node.PanIndex, NODE_CBR);
				setDataMoveAnimation(nodes[node.UI_Node.NodeIndex], nodes[node.UI_Node.RouterIndex], MULTI_HOP);
				nodeTexts[node.UI_Node.RouterIndex].front();
				gatewayTexts[node.UI_Node.PanIndex].front();
				
				const parentsNodeIndex = NodeInfo.findIndex(function(findnode, index, arr){
					return (findnode.Node.ShortID === node.Node.ParentShortID) && (findnode.Node.PanID === node.Node.PanID)
				});
				const parentsNode = NodeInfo[parentsNodeIndex];
				// var parentsNode;
				// for(var i=0; i<NodeInfo.length; i++) {
				// 	if(NodeInfo[i].Node.ShortID == node.Node.ParentShortID && NodeInfo[i].Node.PanID == node.Node.PanID) {
				// 		parentsNode = NodeInfo[i];
				// 	}
				// }

				if(parentsNode.Node.ParentShortID > 0) {
					setDataMoveAnimation(nodes[parentsNode.UI_Node.NodeIndex], nodes[parentsNode.UI_Node.RouterIndex], MULTI_HOP);
					nodeTexts[parentsNode.UI_Node.RouterIndex].front();
					gatewayTexts[parentsNode.UI_Node.PanIndex].front();
				} else {
					setDataMoveAnimation(nodes[parentsNode.UI_Node.NodeIndex], gateways[parentsNode.UI_Node.PanIndex], ONE_HOP);
					gatewayTexts[parentsNode.UI_Node.PanIndex].front();
				}

			}else{
				//setNodeToGatewayLink(node.UI_Node.NodeIndex, node.UI_Node.PanIndex, NODE_CBR);
				setDataMoveAnimation(nodes[node.UI_Node.NodeIndex], gateways[node.UI_Node.PanIndex], ONE_HOP);
				gatewayTexts[node.UI_Node.PanIndex].front();
			}
			node.Status = NODE_DONE;
		}
		
	}

}

function Update_UI_AP(){

	for(var i=0; i<gateways.length; i++){

		setObjectColor(gateways[i], gatewayColors[i]);

		setLineColor(gateways[i], COLOR_GATEWAY_BORDER);
		setLineColor(gatewayOuters[i], COLOR_GATEWAY_OUTER_BORDER);
	}

}

function changeNodeBorderColorStatus(nodeIndex){
	setLineColor(nodes[nodeIndex], COLOR_NODE_BORDER);
	setLineColor(nodeOuters[nodeIndex], COLOR_NODE_OUTER_BORDER);
}

function changeNodeBkgColorStatus(nodeIndex, gatewayIndex){
	setObjectColor(nodes[nodeIndex], gatewayColors[gatewayIndex]);
}

function reloadData() {

	Check_Pan();
	
	Get_NodeInfo();
	
	Get_NodeCount();

	Update_UI_AP();

	Update_UI_Node();

	setTimeout(
		reloadData,
		RELOAD_TIME_INTERVAL
	);
}

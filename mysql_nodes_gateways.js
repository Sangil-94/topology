const reloadtimeinterval = 5*1000;	// msec

const NODE_DEFAULT = -1;
const NODE_NRR = 0;
const NODE_AIR = 1;
const NODE_CBR = 2;
const NODE_DONE = 3;

var Cluster = {};
var NodeInfo = {};


$(document).ready(function() {
	
	init_var();

	reloadData();
	
	$('#btn_reload').click(function(e) {
		location.reload();
	});

} );

function init_var(){

	for(var i=0; i<gateways.length; i++){

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

	for(var i=0; i<nodes.length; i++){

		NodeInfo[i]=
		{
			Node : {
				Idx : -1,
				PanID : -1,
				ShortID : -1,
				ParentShortID : -1,
				dt_nrr : '0000-00-00 00:00:00',
				dt_air : '0000-00-00 00:00:00',
				dt_cbr : '0000-00-00 00:00:00'
			},

			UI_Node : {
				PanIndex : -1,
				NodeIndex : -1,
				RouterIndex : -1,
			},
			
			Status : NODE_DEFAULT,
		}
	}

}

function Check_Pan(){

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

function Get_NodeInfo(){

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

			// original
			if(NodeInfo[idx].Status == NODE_AIR){
				return true;
			}

			switch (parseInt(obj.panid)) {

				case Cluster[0].AP.PanID:
				
					NodeInfo[idx].UI_Node.PanIndex = 0;

					break;

				case Cluster[1].AP.PanID:
					
					NodeInfo[idx].UI_Node.PanIndex = 1;
					
					break;

				case Cluster[2].AP.PanID:
					
					NodeInfo[idx].UI_Node.PanIndex = 2;
					
					break;

				default:
					
					return true;

			}

			NodeInfo[idx].Node.Idx = parseInt(obj.idx);

			if(NodeInfo[idx].Node.Idx > 0){
				Calculate_NodeIdx(idx);
			}

			NodeInfo[idx].Node.PanID = parseInt(obj.panid);
			NodeInfo[idx].Node.ShortID = parseInt(obj.shortid);
			NodeInfo[idx].Node.ParentShortID = parseInt(obj.parentshortid);

			if(NodeInfo[idx].Node.ParentShortID > 0){
				Get_RouterIdx(idx, parseInt(obj.parentshortid), parseInt(obj.panid));
			}

			NodeInfo[idx].Node.dt_nrr = obj.dt_nrr;
			NodeInfo[idx].Node.dt_air = obj.dt_air;
			
			if(obj.dt_nrr > '0000-00-00 00:00:00'){
				NodeInfo[idx].Status = NODE_NRR;
			}

			if(obj.dt_air > '0000-00-00 00:00:00' ){
				NodeInfo[idx].Status = NODE_AIR;
			}

		});

		$("body").css("cursor", "default");

	}).fail(function(jqXHR, textStatus){

		$("body").css("cursor", "default");
		
		alert("Fail : " + textStatus);
	});
	
}

function Calculate_NodeIdx(index){

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

function Calculate_RouterIdx(index, routerIdx){


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

function Get_RouterIdx(index, parentshortid, panid){

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
			mode : "hop_count"
		},
	}).done(function(data) {
		var json = $.parseJSON(data);

		
		$.each(json, function(idx, obj){
			document.getElementById("hop").innerText = obj["hop"] + "개";
			document.getElementById("1hop").innerText = obj["1hop"] + "개";
			document.getElementById("2hop").innerText = obj["2hop"] + "개";
			document.getElementById("3hop").innerText = obj["3hop"] + "개";
		});
	});
}

function Update_UI_Node(){
		
	for(var i=0; i < nodes.length; i++){

		if(NodeInfo[i].Status == NODE_DEFAULT){
			continue;
		}
		
		changeNodeBorderColorStatus(NodeInfo[i].UI_Node.NodeIndex);
		changeNodeBkgColorStatus(NodeInfo[i].UI_Node.NodeIndex, NodeInfo[i].UI_Node.PanIndex);

		if(nodeTexts[i].text() == "") {
			nodeTexts[i] = setObjectText( draw, nodes[NodeInfo[i].UI_Node.NodeIndex], "" + NodeInfo[i].Node.ShortID);
			nodeTexts[i].fill(COLOR_DEFAULT);
			nodeTexts[i].front();	
		}

		if(NodeInfo[i].Status == NODE_NRR){
			continue;
		}

		//2-Hop Check
		if(NodeInfo[i].UI_Node.RouterIndex > -1){

			setNodeToNodeLink(NodeInfo[i].UI_Node.NodeIndex, NodeInfo[i].UI_Node.RouterIndex, NodeInfo[i].UI_Node.PanIndex);
			nodeTexts[NodeInfo[i].UI_Node.RouterIndex].front();
			gatewayTexts[NodeInfo[i].UI_Node.PanIndex].front();

		}else{

			setNodeToGatewayLink(NodeInfo[i].UI_Node.NodeIndex, NodeInfo[i].UI_Node.PanIndex);
			gatewayTexts[NodeInfo[i].UI_Node.PanIndex].front();
			
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

function reloadData(){

	Check_Pan();
	
	Get_NodeInfo();
	
	Get_NodeCount();

	Update_UI_AP();

	Update_UI_Node();

	setTimeout(
		reloadData,
		reloadtimeinterval
	);
}

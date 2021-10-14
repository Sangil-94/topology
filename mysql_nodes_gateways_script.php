<?php
session_start();

include "./mySql/db_connect.php";

$msg = "";

// ----------------------------------------------------------------------------
// Query 조건
$query_where = "";

// if($_POST[search_idx]!=null && strlen($_POST[search_idx])>0) {
//   $query_where .= " and idx = '".$_POST[search_idx]."'";
// }
// if($_POST[idx]!=null && strlen($_POST[idx])>0) {
//   $query_where .= " and idx = '".$_POST[idx]."'";
// }


// if($_POST[search_deviceid]!=null && strlen($_POST[search_deviceid])>0) {
//   $query_where .= " and deviceid = '".$_POST[search_deviceid]."'";
// }
// if($_POST[search_sourceid]!=null && strlen($_POST[search_sourceid])>0) {
//   $query_where .= " and sourceid = '".$_POST[search_sourceid]."'";
// }

// if($_POST[search_panid]!=null && strlen($_POST[search_panid])>0) {
//   $query_where .= " and panid = '".$_POST[search_panid]."'";
// }

// if($_POST[search_devicename]!=null && strlen($_POST[search_devicename])>0) {
//   $query_where .= " and devicename like '%".$_POST[search_devicename]."%'";
// }


// if($_POST[search_memo]!=null && strlen($_POST[search_memo])>0) {
//   $query_where .= " and memo like '%".$_POST[search_memo]."%'";
// }


// if(strcmp($_POST[st_date], $_POST[ed_date]) > 0) {
//   $msg = "검색 일시 시작/종료 날짜가 잘못 설정되었습니다.";
// }


// if($_POST[st_date]!=null && strlen($_POST[st_date])>0) {
// 	$query_where .= " and dt >= '".$_POST[st_date]." 00:00:00'";
// }
// if($_POST[ed_date]!=null && strlen($_POST[ed_date])>0) {
// 	$query_where .= " and dt <= '".$_POST[ed_date]." 23:59:59'";
// }


// ----------------------------------------------------------------------------
// mode 에 따른 실행

if($msg != "") {
 
}
else if($_POST[mode]=="select_pan") {
  $query = " SELECT panid, shortid FROM pan WHERE 1 ";
  $query .= $query_where;
  $query .= "ORDER BY panid ASC";

  $result = mysql_query($query);

  $msg .= "[";

  while(($line = mysql_fetch_assoc($result))) {

    $msg .= json_encode($line);
    $msg .= ",";

  }

  $msg .= "]";
  $msg = str_replace("},]", "}]", $msg);

}

// dr_srn 찾기
else if($_POST[mode]=="select_nodes") {
  $query = " SELECT idx, panid, shortid, parentshortid, rx_noderegistrationrequest AS dt_nrr, rx_allocationinforesponse AS dt_air 
  FROM node WHERE shortid > 0 ";
  $query .= $query_where; 
  $query .= " ORDER BY idx ASC";

  $result = mysql_query($query);

  $msg .= "[";

  while(($line = mysql_fetch_assoc($result))) {

    $msg .= json_encode($line);
    $msg .= ",";
  }

  $msg .= "]";
  $msg = str_replace("},]", "}]", $msg);

}
// dt_gar 찾기
else if($_POST[mode]=="select_nodeinfo") {
  $query = " SELECT idx, panid, shortid, parentshortid, rx_noderegistrationrequest AS dt_nrr, rx_allocationinforesponse AS dt_air, rx_testcbr AS dt_cbr
  FROM node WHERE shortid > 0 ";
  $query .= $query_where; 
  $query .= " ORDER BY idx ASC";

  $result = mysql_query($query);

  $msg .= "[";

  while(($line = mysql_fetch_assoc($result))) {

    $msg .= json_encode($line);
    $msg .= ",";
  }

  $msg .= "]";
  $msg = str_replace("},]", "}]", $msg);

}
else if($_POST[mode]=="select_nodeIndex") {
  
  $query = " SELECT count(*) AS idx FROM node";
  $query .= " WHERE idx < '".$_POST[my_idx]."' AND shortid > 0";
  // $query .= $query_where; 
  // $query .= " ORDER BY panid ASC, shortid ASC";

  $result = mysql_query($query);

  $msg .= "[";

  while(($line = mysql_fetch_assoc($result))) {

    $msg .= json_encode($line);
    $msg .= ",";
  }

  $msg .= "]";
  $msg = str_replace("},]", "}]", $msg);
}
else if($_POST[mode]=="select_router"){

  $query=" SELECT idx FROM node WHERE shortid = '".$_POST[router_shortid]."' AND panid = '".$_POST[panid]."' ";

  $result = mysql_query($query);
  $msg .= "[";

  while(($line = mysql_fetch_assoc($result))) {

    $msg .= json_encode($line);
    $msg .= ",";
  }

  $msg .= "]";
  $msg = str_replace("},]", "}]", $msg);
}
else if($_POST[mode] == "hop_count") {
  $query ="SELECT COUNT(CASE WHEN treedepth!=0 THEN 1 END) AS hop, COUNT(CASE WHEN treedepth=1 THEN 1 END) AS 1hop, COUNT(CASE WHEN treedepth=2 THEN 1 END) AS 2hop, COUNT(CASE WHEN treedepth=3 THEN 1 END) AS 3hop, COUNT(CASE WHEN panid=32769 AND treedepth>0 THEN 1 END) AS pan1, COUNT(CASE WHEN panid=36865 AND treedepth>0 THEN 1 END) AS pan2, COUNT(CASE WHEN panid=40961 AND treedepth>0 THEN 1 END) AS pan3 FROM node;";
  $result = mysql_query($query);
  $msg .= "[";

  while(($line = mysql_fetch_assoc($result))) {

    $msg .= json_encode($line);
    $msg .= ",";
  }

  $msg .= "]";
  $msg = str_replace("},]", "}]", $msg);
}
else{
	
}
// else if($_POST[mode]=="selectsource") {
// 	$query = " SELECT dt, sourceid, v_flame, v_temp, v_smoke, v_battery FROM total WHERE 1=1";
// 	$query .= $query_where;
// 	//$query .= " and sourceid = '".$_POST[search_sourceid]."'";
// 	//$query .= " and dt <= DATE_SUB(NOW(), INTERVAL 1 SECOND)";
// 	//$query .= " and dt <= DATE_SUB(NOW(), INTERVAL 1 SECOND)";
// 	$query .= " ORDER BY dt DESC ";

// 	$query .= " LIMIT ".$_POST[limit]." ";

// 	$result = mysql_query($query);
// 	$msg .= "[";
// 	while(($line = mysql_fetch_array($result))) {

// 		$line[cur_dt] = date("Y-m-d H:i:s", time());

// 		$msg .= json_encode($line);
// 		$msg .= ",";
// 	}
// 	$msg .= "]";
// 	$msg = str_replace("},]", "}]", $msg);

// 	//$msg .= $query;
// }
// else if($_POST[mode]=="selectpackets") {
// 	$query = " SELECT dt, COUNT(IF(sourceid=1, sourceid, null)) AS sourceid1, COUNT(IF(sourceid=2, sourceid, null)) AS sourceid2, COUNT(IF(sourceid=3, sourceid, null)) AS sourceid3, COUNT(IF(sourceid=4, sourceid, null)) AS sourceid4, COUNT(IF(sourceid=5, sourceid, null)) AS sourceid5, COUNT(IF(sourceid=6, sourceid, null)) AS sourceid6, COUNT(IF(sourceid=11, sourceid, null)) AS sourceid7 FROM total WHERE 1=1 ";
// 	$query .= $query_where;
// 	$query .= " and dt <= DATE_SUB(NOW(), INTERVAL 1 SECOND)";
// 	$query .= " GROUP BY dt ORDER BY dt DESC ";
// 	$query .= " LIMIT ".$_POST[limit]." ";

// 	$result = mysql_query($query);
// 	$msg .= "[";
// 	while(($line = mysql_fetch_array($result))) {

// 		$line[cur_dt] = date("Y-m-d H:i:s", time());

// 		$msg .= json_encode($line);
// 		$msg .= ",";
// 	}
// 	$msg .= "]";
// 	$msg = str_replace("},]", "}]", $msg);

// 	//$msg .= $query;
// }
// else if($_POST[mode]=="countnodegateway") {
// 	$query = " SELECT COUNT(IF(sourceid=1, sourceid, null)) AS sourceid1, COUNT(IF(sourceid=2, sourceid, null)) AS sourceid2, COUNT(IF(sourceid=3, sourceid, null)) AS sourceid3, COUNT(IF(sourceid=4, sourceid, null)) AS sourceid4, COUNT(IF(sourceid=5, sourceid, null)) AS sourceid5, COUNT(IF(sourceid=6, sourceid, null)) AS sourceid6, COUNT(IF(sourceid=11, sourceid, null)) AS sourceid7 FROM total WHERE 1=1 ";
// 	$query .= $query_where;
// 	$query .= " and daddr = '".$_POST[daddr]."'";
// 	$query .= " and dt >= DATE_SUB(NOW(), INTERVAL 5 SECOND)";
// //	$query .= " GROUP BY dt ORDER BY dt DESC ";
// //	$query .= " LIMIT ".$_POST[limit]." ";

// 	$result = mysql_query($query);
// 	$msg .= "[";
// 	while(($line = mysql_fetch_array($result))) {

// 		$line[cur_dt] = date("Y-m-d H:i:s", time());

// 		$msg .= json_encode($line);
// 		$msg .= ",";
// 	}
// 	$msg .= "]";
// 	$msg = str_replace("},]", "}]", $msg);

// 	//$msg .= $query;
// }
// else if($_POST[mode]=="countnodetonode") {
// 	$query = " SELECT 
// COUNT(IF(sourceid=1 and routeaddr=2, routeaddr, null)) AS sourceid1r2,
// COUNT(IF(sourceid=1 and routeaddr=3, routeaddr, null)) AS sourceid1r3,
// COUNT(IF(sourceid=1 and routeaddr=4, routeaddr, null)) AS sourceid1r4,
// COUNT(IF(sourceid=1 and routeaddr=5, routeaddr, null)) AS sourceid1r5,
// COUNT(IF(sourceid=1 and routeaddr=6, routeaddr, null)) AS sourceid1r6,

// COUNT(IF(sourceid=2 and routeaddr=1, routeaddr, null)) AS sourceid2r1,
// COUNT(IF(sourceid=2 and routeaddr=3, routeaddr, null)) AS sourceid2r3,
// COUNT(IF(sourceid=2 and routeaddr=4, routeaddr, null)) AS sourceid2r4,
// COUNT(IF(sourceid=2 and routeaddr=5, routeaddr, null)) AS sourceid2r5,
// COUNT(IF(sourceid=2 and routeaddr=6, routeaddr, null)) AS sourceid2r6,

// COUNT(IF(sourceid=3 and routeaddr=1, routeaddr, null)) AS sourceid3r1,
// COUNT(IF(sourceid=3 and routeaddr=2, routeaddr, null)) AS sourceid3r2,
// COUNT(IF(sourceid=3 and routeaddr=4, routeaddr, null)) AS sourceid3r4,
// COUNT(IF(sourceid=3 and routeaddr=5, routeaddr, null)) AS sourceid3r5,
// COUNT(IF(sourceid=3 and routeaddr=6, routeaddr, null)) AS sourceid3r6,

// COUNT(IF(sourceid=4 and routeaddr=1, routeaddr, null)) AS sourceid4r1,
// COUNT(IF(sourceid=4 and routeaddr=2, routeaddr, null)) AS sourceid4r2,
// COUNT(IF(sourceid=4 and routeaddr=3, routeaddr, null)) AS sourceid4r3,
// COUNT(IF(sourceid=4 and routeaddr=5, routeaddr, null)) AS sourceid4r5,
// COUNT(IF(sourceid=4 and routeaddr=6, routeaddr, null)) AS sourceid4r6,

// COUNT(IF(sourceid=5 and routeaddr=1, routeaddr, null)) AS sourceid5r1,
// COUNT(IF(sourceid=5 and routeaddr=2, routeaddr, null)) AS sourceid5r2,
// COUNT(IF(sourceid=5 and routeaddr=3, routeaddr, null)) AS sourceid5r3,
// COUNT(IF(sourceid=5 and routeaddr=5, routeaddr, null)) AS sourceid5r5,
// COUNT(IF(sourceid=5 and routeaddr=6, routeaddr, null)) AS sourceid5r6,

// COUNT(IF(sourceid=6 and routeaddr=1, routeaddr, null)) AS sourceid6r1,
// COUNT(IF(sourceid=6 and routeaddr=2, routeaddr, null)) AS sourceid6r2,
// COUNT(IF(sourceid=6 and routeaddr=3, routeaddr, null)) AS sourceid6r3,
// COUNT(IF(sourceid=6 and routeaddr=4, routeaddr, null)) AS sourceid6r4,
// COUNT(IF(sourceid=6 and routeaddr=6, routeaddr, null)) AS sourceid6r6

// FROM total WHERE 1=1";
// 	$query .= $query_where;
// //	$query .= " and daddr = '".$_POST[daddr]."'";
// 	$query .= " and dt >= DATE_SUB(NOW(), INTERVAL 5 SECOND)";
// //	$query .= " GROUP BY dt ORDER BY dt DESC ";
// //	$query .= " LIMIT ".$_POST[limit]." ";

// 	$result = mysql_query($query);
// 	$msg .= "[";
// 	while(($line = mysql_fetch_array($result))) {

// 		$line[cur_dt] = date("Y-m-d H:i:s", time());

// 		$msg .= json_encode($line);
// 		$msg .= ",";
// 	}
// 	$msg .= "]";
// 	$msg = str_replace("},]", "}]", $msg);

// 	//$msg .= $query;
// }
// else if($_POST[mode]=="selectvoltage") {
// 	$query = " SELECT dt, dt6, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8 FROM total WHERE 1=1 ";
// 	$query .= $query_where;
// 	$query .= " and sourceid = '".$_POST[search_sourceid]."'";
// 	$query .= " ORDER BY dt6 DESC ";
// 	$query .= " LIMIT ".$_POST[limit]." ";

// 	$result = mysql_query($query);
// 	$msg .= "[";
// 	while(($line = mysql_fetch_array($result))) {

// 		$line[cur_dt] = date("Y-m-d H:i:s", time());

// 		$msg .= json_encode($line);
// 		$msg .= ",";
// 	}
// 	$msg .= "]";
// 	$msg = str_replace("},]", "}]", $msg);

// 	//$msg .= $query;
// }
// else if($_POST[mode]=="select_temp") {
// 	$query = " SELECT dt, sourceid, v_temp FROM total WHERE 1=1 ";
// 	$query .= $query_where;
// 	//$query .= " and sourceid = '".$_POST[search_sourceid]."'";
// 	//$query .= " GROUP BY dt ORDER BY dt6 DESC ";
// 	$query .= " ORDER BY dt DESC ";
// 	$query .= " LIMIT ".$_POST[limit]." ";

// 	$result = mysql_query($query);
// 	$msg .= "[";
// 	while(($line = mysql_fetch_array($result))) {

// 		$line[cur_dt] = date("Y-m-d H:i:s", time());

// 		$msg .= json_encode($line);
// 		$msg .= ",";
// 	}
// 	$msg .= "]";
// 	$msg = str_replace("},]", "}]", $msg);

// 	//$msg .= $query;
// }
// else if($_POST[mode]=="select_smoke") {
// 	$query = " SELECT dt, sourceid, v_smoke FROM total WHERE 1=1 ";
// 	$query .= $query_where;
// 	//$query .= " and sourceid = '".$_POST[search_sourceid]."'";
// 	//$query .= " GROUP BY dt ORDER BY dt6 DESC ";
// 	$query .= " ORDER BY dt DESC ";
// 	$query .= " LIMIT ".$_POST[limit]." ";

// 	$result = mysql_query($query);
// 	$msg .= "[";
// 	while(($line = mysql_fetch_array($result))) {

// 		$line[cur_dt] = date("Y-m-d H:i:s", time());

// 		$msg .= json_encode($line);
// 		$msg .= ",";
// 	}
// 	$msg .= "]";
// 	$msg = str_replace("},]", "}]", $msg);

// 	//$msg .= $query;
// }

// else if($_POST[mode]=="selectalarm") {
//   $query = " SELECT * FROM total WHERE 1=1 and alarmcode>0 ";

//   $query .= $query_where;
//   $query .= " order by ".$_POST[orderby]." ".$_POST[order]." limit ".$_POST[limit]." ";



//   $result = mysql_query($query);
//   $msg .= "[";
//   while(($line = mysql_fetch_array($result))) {

//     $line[cur_dt] = date("Y-m-d H:i:s", time());

//     $msg .= json_encode($line);
//     $msg .= ",";
//   }
//   $msg .= "]";
//   $msg = str_replace("},]", "}]", $msg);
// }
// else if($_POST[mode]=="selectpsr") {
// 	$query = " SELECT sourceid, psr, success, error, total, seq, timestamp FROM psr WHERE 1=1 ";
// 	$query .= $query_where;
// 	//$query .= " and sourceid = '".$_POST[search_sourceid]."'";
// 	//$query .= " GROUP BY dt ORDER BY dt6 DESC ";
// 	$query .= $query_where;
// 	$query .= " order by ".$_POST[orderby]." ".$_POST[order]." limit ".$_POST[limit]." ";

// 	$result = mysql_query($query);
// 	$msg .= "[";
// 	while(($line = mysql_fetch_array($result))) {

// 		//$line[cur_dt] = date("Y-m-d H:i:s", time());

// 		$msg .= json_encode($line);
// 		$msg .= ",";
// 	}
// 	$msg .= "]";
// 	$msg = str_replace("},]", "}]", $msg);

// 	//$msg .= $query;
// }

// else if($_POST[mode]=="selectconfig") {
//   $query = " SELECT * FROM config WHERE 1=1";
//   $query .= $query_where;

//   $result = mysql_query($query);
//   $msg .= "[";
//   while(($line = mysql_fetch_array($result))) {

//     $line[cur_dt] = date("Y-m-d H:i:s", time());

//     $msg .= json_encode($line);
//     $msg .= ",";
//   }
//   $msg .= "]";
//   $msg = str_replace("},]", "}]", $msg);
// }
// else if($_POST[mode]=="updateconfig") {

// 	$query = " UPDATE config SET ";
// 	$query .= "chartmaxitems = '".$_POST[chartmaxitems]."'";
// 	$query .= ", voltagemaxitems = '".$_POST[voltagemaxitems]."'";
// 	$query .= ", channelmaxitems = '".$_POST[channelmaxitems]."'";
// 	$query .= ", reloadtimeinterval = '".$_POST[reloadtimeinterval]."'";
// 	$query .= ", selectedsourceid = '".$_POST[selectedsourceid]."'";
// 	/*
// 	$query .= ", limitrstmin = '".$_POST[limitrstmin]."'";
// 	$query .= ", limitrstmax = '".$_POST[limitrstmax]."'";
// 	$query .= ", limitrstdiff = '".$_POST[limitrstdiff]."'";
// 	$query .= ", noresponseinterval = '".$_POST[noresponseinterval]."'";
// 	*/

// 	$query .= " WHERE 1=1 ";
// 	$query .= $query_where;


// 	$result = mysql_query($query);
// 	if(!$result) {
// 		// Fail
// 		$msg = "[FAIL] error mysql_query() <br>".$query;
// 	}
// 	else {
// 		// ------------------------------------------------------------------------
// 		// Log
// 		//AddLog($_SESSION['valid_user'], '', 'Modify', "Modify Locker Pay".$_POST[rgroup]."(".$_POST[rname].")", $query);
// 		//$msg = "[FAIL] 테스트<br>".$query;
// 	}
// }
// ----------------------------------------------------------------------------
// 결과 출력
if($msg!="") {
  ob_clean(); // 초기화
  echo $msg;
}

include "./mySql/db_close.php";

?>
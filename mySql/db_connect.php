<?php 
// $dbserver_ip = "192.168.0.29:3306";
// $dbserver_ip = "192.168.0.101:3306";
$dbserver_ip = "192.168.0.170:3306";
$dblink = mysql_connect($dbserver_ip, "root", "apmsetup");
if(!$dblink) {
	sleep(5);	// wait 1 seconds

	echo "<script>location.reload();</script>";
	echo "wait connection";
	return;

}
mysql_select_db("annms_v191") or die("Fail - mysql_select_db()");

mysql_query("set session character_set_connection=utf8;");
mysql_query("set session character_set_results=utf8;");
mysql_query("set session character_set_client=utf8;");
?>
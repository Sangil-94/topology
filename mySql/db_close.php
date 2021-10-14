<?php
	// 접속 종료
	if($dblink) {
		mysql_close($dblink);
		unset($dblink);
	}

?>
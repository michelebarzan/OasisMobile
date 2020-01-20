<?php
	include "connessione.php";

    $name=$_REQUEST ['name'];
    $value=$_REQUEST ['value'];
    $id_utente=$_REQUEST ['id_utente'];

	$q="DELETE FROM serverSideSettings WHERE [name]='$name' AND utente=$id_utente";
	$r=sqlsrv_query($conn,$q);
	if($r==FALSE)
	{
		die("error");
	}
	else
	{
		$q2="INSERT INTO serverSideSettings ([name],[value],[utente]) VALUES ('$name','$value',$id_utente)";
		$r2=sqlsrv_query($conn,$q2);
		if($r2==FALSE)
		{
			die("error");
		}
		else
			echo "ok";
	}

?>
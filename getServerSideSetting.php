<?php
	include "connessione.php";

    $name=$_REQUEST ['name'];
    $id_utente=$_REQUEST ['id_utente'];
    
    $q="SELECT [value] FROM serverSideSettings WHERE [name]='$name' AND utente=$id_utente";
	$r=sqlsrv_query($conn,$q);
	if($r==FALSE)
	{
		die("error");
	}
    else
    {
        while($row=sqlsrv_fetch_array($r))
		{
            echo $row['value'];
        }
    }
?>
<?php
	include "connessione.php";

    $name=$_REQUEST ['name'];
    
    $q="SELECT [valore] FROM parametri WHERE [nome]='".$name."_default'";
	$r=sqlsrv_query($conn,$q);
	if($r==FALSE)
	{
		die("error");
	}
    else
    {
        while($row=sqlsrv_fetch_array($r))
		{
            echo $row['valore'];
        }
    }
?>
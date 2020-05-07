<?php

    include "connessione.php";

    $id_documento=$_REQUEST["id_documento"];

    $query2="DELETE FROM dbo.documentazione WHERE id_documento = $id_documento";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2!==TRUE)
    {
        echo "ok";
    }
    else
        die("error");


?>
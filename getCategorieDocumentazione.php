<?php

    include "connessione.php";

    $categorie=[];

    $query2="SELECT DISTINCT categoria FROM dbo.documentazione WHERE eliminato = 'false' ORDER BY categoria";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            array_push($categorie,$row2['categoria']);
        }
    }
    else
        die("error");

    echo json_encode($categorie);

?>
<?php

    include "connessione.php";

    $colonna=$_REQUEST["colonna"];
    $id_automezzo=$_REQUEST["id_veicolo"];

    $query2="SELECT [".$colonna."] FROM dbo.anagrafica_automezzi WHERE id_automezzo=$id_automezzo";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            echo $row2[$colonna];
        }
    }
    else
        die("error".$query2)
?>
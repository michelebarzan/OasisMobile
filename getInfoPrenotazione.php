<?php

    include "connessione.php";

    $colonna=$_REQUEST["colonna"];
    $tipo=$_REQUEST["tipo"];
    $id_prenotazione=$_REQUEST["id_prenotazione"];

    $query2="SELECT [".$colonna."] FROM dbo.prenotazioni_automezzi WHERE id_prenotazione=$id_prenotazione";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            if($tipo=="data")
                echo $row2[$colonna]->format("d/m/Y h:i:s");
            else
                echo $row2[$colonna];
        }
    }
    else
        die("error".$query2)
?>
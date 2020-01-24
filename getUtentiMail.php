<?php

    include "connessione.php";

    $utenti=[];

    $query2="SELECT * FROM dbo.utenti WHERE mail IS NOT NULL AND eliminato='false'";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $utente["value"]=$row2['id_utente'];
            $utente["label"]=$row2['username'];

            array_push($utenti,$utente);
        }
    }

    echo json_encode($utenti);

?>
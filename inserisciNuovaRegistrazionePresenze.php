<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $query2="INSERT INTO registrazioni_presenze (utente,dataInizio,chiusa) VALUES ($id_utente,GETDATE(),'false')";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==FALSE)
        die("error")

?>
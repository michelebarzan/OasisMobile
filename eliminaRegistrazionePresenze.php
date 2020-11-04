<?php

    include "connessione.php";

    $id_registrazione=$_REQUEST["id_registrazione"];

    $query2="DELETE FROM registrazioni_presenze WHERE id_registrazione=$id_registrazione";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==FALSE)
        die("error".$query2)

?>
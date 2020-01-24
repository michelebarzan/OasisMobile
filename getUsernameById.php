<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $query2="SELECT username FROM utenti WHERE id_utente=$id_utente";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            echo $row2["username"];
        }
    }
    else
        die("error".$query2)
?>
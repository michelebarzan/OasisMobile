<?php
	include "connessione.php";

    $id_richiesta=$_REQUEST ['id_richiesta'];

    $q="SELECT utente_creazione FROM richieste_e_faq WHERE id_richiesta=$id_richiesta";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            echo $row['utente_creazione'];
        }
    }
    
?>
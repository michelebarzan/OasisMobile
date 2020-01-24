<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $query2="SELECT max(id_prenotazione) AS id_prenotazione FROM dbo.prenotazioni_automezzi WHERE utente_apertura=$id_utente AND stato='open'";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $rows = sqlsrv_has_rows( $result2 );
        if ($rows === true)
        {
            while($row2=sqlsrv_fetch_array($result2))
            {
                echo $row2['id_prenotazione'];
            }
        }
    }
    else
        die("error")

?>
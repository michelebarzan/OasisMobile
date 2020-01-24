<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $prenotazioni_aperte=[];

    $query2="SELECT  id_prenotazione FROM dbo.prenotazioni_automezzi WHERE utente_apertura=$id_utente AND stato='open'";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $rows = sqlsrv_has_rows( $result2 );
        if ($rows === true)
        {
            while($row2=sqlsrv_fetch_array($result2))
            {
                array_push($prenotazioni_aperte,$row2['id_prenotazione']);
            }
        }
        echo json_encode($prenotazioni_aperte);
    }
    else
        die("error")

?>
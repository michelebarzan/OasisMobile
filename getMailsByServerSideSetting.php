<?php
	include "connessione.php";

    $utentiInvioMail=json_decode($_REQUEST ['JSONutentiInvioMail']);
    $serverSideSetting=$_REQUEST ['serverSideSetting'];

    $mails=[];
    
    foreach ($utentiInvioMail as $id_utente) 
    {
        $q="SELECT dbo.utenti.mail
            FROM dbo.serverSideSettings INNER JOIN dbo.utenti ON dbo.serverSideSettings.utente = dbo.utenti.id_utente
            WHERE (dbo.serverSideSettings.name = '$serverSideSetting') AND (dbo.serverSideSettings.value = 'true') AND (dbo.utenti.id_utente = $id_utente)";
        $r=sqlsrv_query($conn,$q);
        if($r==FALSE)
        {
            die("error");
        }
        else
        {
            while($row=sqlsrv_fetch_array($r))
            {
                array_push($mails,$row['mail']);
            }
        }
    }
    echo json_encode($mails);
?>
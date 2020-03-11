
<?php

    include "connessione.php";

    $ordine=$_REQUEST['ordine'];
    $stazione=$_REQUEST['stazione'];

    $fotoOrdine=[];

    //$server_adress=$_SERVER['SERVER_ADDR'];
	$server_adress="remote.oasisgroup.it";
    $path="http://$server_adress/oasisfotoproduzione/FotoProduzioneAndroid/";

    $query2="SELECT DISTINCT dbo.registrazioni_produzione.ordine, dbo.registrazioni_produzione.stazione, REPLACE(REPLACE(dbo.allegati_registrazioni_produzione.percorso, '+', ''), '//srv-01/Produzione/', '') AS percorso FROM dbo.allegati_registrazioni_produzione INNER JOIN dbo.registrazioni_produzione ON dbo.allegati_registrazioni_produzione.registrazione_produzione = dbo.registrazioni_produzione.id_registrazione WHERE ordine='$ordine' AND stazione='$stazione'";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $nomeFile=explode($stazione."/",$row2['percorso'])[1];
            $foto["nomeFile"]=$nomeFile;
            $foto["percorso"]=$path.$ordine."/".$stazione."/".$nomeFile;
            array_push($fotoOrdine,$foto);
        }
        echo json_encode($fotoOrdine);
    }
    else
        die("error");

?>
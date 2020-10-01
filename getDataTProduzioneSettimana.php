<?php

    include "connessione.php";

    $stazione=$_REQUEST['stazione'];
    $settimana=$_REQUEST['settimana'];

    $rows=[];

    $query2="SELECT DISTINCT derivedtbl_1.docnum, CONVERT(decimal(4, 2), derivedtbl_1.mq) AS mq, derivedtbl_1.basi_portalavabo, derivedtbl_1.basi_accostabili, derivedtbl_1.pensili, derivedtbl_1.colonne, derivedtbl_1.Altro, derivedtbl_1.dataConsegna, 
            derivedtbl_1.totale_pezzi, derivedtbl_1.stazione, derivedtbl_1.settimana, derivedtbl_1.stato, dbo.collezione.collezione
            FROM (SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
            FROM dbo.sommario_produzione_montaggio
            UNION ALL
            SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
            FROM dbo.sommario_produzione_verniciatura
            UNION ALL
            SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
            FROM dbo.sommario_produzione_punto_punto) AS derivedtbl_1 LEFT OUTER JOIN
            dbo.collezione ON derivedtbl_1.docnum = dbo.collezione.DocNum
            WHERE (derivedtbl_1.settimana = $settimana) AND (derivedtbl_1.stazione = '$stazione')";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            if($row2["mq"]=="0")
                $row2["mq"]=0;
            $row2["dataConsegna"]=$row2['dataConsegna']->format("d/m/Y");
            array_push($rows,$row2);
        }
        
        echo json_encode($rows);
    }
    else
        die("error");

?>
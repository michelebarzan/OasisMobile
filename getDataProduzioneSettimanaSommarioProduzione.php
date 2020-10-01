
<?php

include "connessione.php";

$stazione=$_REQUEST['stazione'];
$settimana=$_REQUEST['settimana'];
$produzioneSettimanaFilter=json_decode($_REQUEST['JSONproduzioneSettimanaFilter'],true);

$dataPoints=[];

if($produzioneSettimanaFilter["colonna"]=="ordini")
{
    $query2="SELECT DISTINCT COUNT(derivedtbl_1.docnum) AS y, derivedtbl_1.stato AS label
            FROM (SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                FROM dbo.sommario_produzione_montaggio
                UNION ALL
                SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                FROM dbo.sommario_produzione_verniciatura
                UNION ALL
                SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                FROM dbo.sommario_produzione_punto_punto) AS derivedtbl_1 LEFT OUTER JOIN
                dbo.collezione ON derivedtbl_1.docnum = dbo.collezione.DocNum
            GROUP BY derivedtbl_1.stazione, derivedtbl_1.settimana, derivedtbl_1.stato
            HAVING (derivedtbl_1.settimana = $settimana) AND (derivedtbl_1.stazione = '$stazione')";
}
else
{
    $query2="SELECT DISTINCT SUM(derivedtbl_1.".$produzioneSettimanaFilter['colonna'].") AS y, derivedtbl_1.stato AS label
            FROM (SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                FROM dbo.sommario_produzione_montaggio
                UNION ALL
                SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                FROM dbo.sommario_produzione_verniciatura
                UNION ALL
                SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                FROM dbo.sommario_produzione_punto_punto) AS derivedtbl_1 LEFT OUTER JOIN
                dbo.collezione ON derivedtbl_1.docnum = dbo.collezione.DocNum
            GROUP BY derivedtbl_1.stazione, derivedtbl_1.settimana, derivedtbl_1.stato
            HAVING (derivedtbl_1.settimana = $settimana) AND (derivedtbl_1.stazione = '$stazione')";
}

$result2=sqlsrv_query($conn,$query2);
if($result2==TRUE)
{
    while($row2=sqlsrv_fetch_array($result2))
    {
        $dataPoint["y"]=$row2['y'];
        $dataPoint["label"]=$row2['label'];
        if($row2['label']=="Prodotto")
            $dataPoint["color"]="rgb(0, 153, 0)";
        if($row2['label']=="Non prodotto")
            $dataPoint["color"]="red";
        if($row2['label']=="Aggiunto")
            $dataPoint["color"]="#4C91CB";

        array_push($dataPoints,$dataPoint);
    }
    
    echo json_encode($dataPoints);
}
else
    die("error");

?>
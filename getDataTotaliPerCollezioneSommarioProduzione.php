
<?php

include "connessione.php";

$stazione=$_REQUEST['stazione'];
$totaliPerCollezioneFilter=json_decode($_REQUEST['JSONtotaliPerCollezioneFilter'],true);
$dataInizio=date('m/d/Y',strtotime($_REQUEST['dataInizio']));
$dataFine=date('m/d/Y',strtotime($_REQUEST['dataFine']));

$data=[];

if($totaliPerCollezioneFilter["colonna"]=="ordini")
{
    $query2="SELECT collezione AS label, COUNT(docnum) AS y
    FROM (SELECT registrazioni_produzione.docnum, registrazioni_produzione.mq, registrazioni_produzione.basi_portalavabo, registrazioni_produzione.basi_accostabili, registrazioni_produzione.pensili, 
                                                        registrazioni_produzione.colonne, registrazioni_produzione.Altro, registrazioni_produzione.totale_pezzi, registrazioni_produzione.stazione, registrazioni_produzione.mese, registrazioni_produzione.anno, 
                                                        ISNULL(dbo.collezione.collezione, 'Nessuna') AS collezione
                              FROM (SELECT derivedtbl_1.docnum, derivedtbl_1.mq, derivedtbl_1.basi_portalavabo, derivedtbl_1.basi_accostabili, derivedtbl_1.pensili, derivedtbl_1.colonne, derivedtbl_1.Altro, derivedtbl_1.totale_pezzi, 
                                                                                  derivedtbl_1.stazione, DATEPART(mm, dbo.Calendar.[data-]) AS mese, DATEPART(yy, dbo.Calendar.[data-]) AS anno
                                                        FROM (SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                                                                                  FROM dbo.sommario_produzione_montaggio
                                                                                  UNION ALL
                                                                                  SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                                                                                  FROM dbo.sommario_produzione_verniciatura
                                                                                  UNION ALL
                                                                                  SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                                                                                  FROM dbo.sommario_produzione_punto_punto) AS derivedtbl_1 INNER JOIN
                                                                                  dbo.Calendar ON derivedtbl_1.settimana = dbo.Calendar.KW_ID
                                                        WHERE (dbo.Calendar.[data-] BETWEEN '$dataInizio' AND '$dataFine')) AS registrazioni_produzione LEFT OUTER JOIN
                                                        dbo.collezione ON registrazioni_produzione.docnum = dbo.collezione.DocNum
                              WHERE (registrazioni_produzione.stazione = '$stazione')) AS t
    GROUP BY collezione";
}
else
{
    $query2="SELECT collezione AS label, SUM(".$totaliPerCollezioneFilter['colonna'].") AS y
            FROM (SELECT registrazioni_produzione.docnum, registrazioni_produzione.mq, registrazioni_produzione.basi_portalavabo, registrazioni_produzione.basi_accostabili, registrazioni_produzione.pensili, 
                registrazioni_produzione.colonne, registrazioni_produzione.Altro, registrazioni_produzione.totale_pezzi, registrazioni_produzione.stazione, registrazioni_produzione.mese, registrazioni_produzione.anno, 
                ISNULL(dbo.collezione.collezione, 'Nessuna') AS collezione
                FROM (SELECT derivedtbl_1.docnum, derivedtbl_1.mq, derivedtbl_1.basi_portalavabo, derivedtbl_1.basi_accostabili, derivedtbl_1.pensili, derivedtbl_1.colonne, derivedtbl_1.Altro, derivedtbl_1.totale_pezzi, 
                derivedtbl_1.stazione, DATEPART(mm, dbo.Calendar.[data-]) AS mese, DATEPART(yy, dbo.Calendar.[data-]) AS anno
                FROM (SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                FROM dbo.sommario_produzione_montaggio
                UNION ALL
                SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                FROM dbo.sommario_produzione_verniciatura
                UNION ALL
                SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                FROM dbo.sommario_produzione_punto_punto) AS derivedtbl_1 INNER JOIN
                dbo.Calendar ON derivedtbl_1.settimana = dbo.Calendar.KW_ID WHERE (dbo.Calendar.[data-] BETWEEN '$dataInizio' AND '$dataFine')) AS registrazioni_produzione LEFT OUTER JOIN
                dbo.collezione ON registrazioni_produzione.docnum = dbo.collezione.DocNum
            WHERE (registrazioni_produzione.stazione = '$stazione')) AS t
            GROUP BY collezione";
}

$result2=sqlsrv_query($conn,$query2);
if($result2==TRUE)
{
    while($row2=sqlsrv_fetch_array($result2))
    {
        $dot['label']=utf8_encode($row2['label']);
        /*echo $row2['y']."\n";*/
        $dot['y']=floatval($row2['y']);
        array_push($data,$dot);
    }
    
    echo json_encode($data);
}
else
    die("error".$query2);

?>
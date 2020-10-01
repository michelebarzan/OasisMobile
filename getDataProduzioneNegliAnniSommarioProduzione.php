
<?php

    include "connessione.php";

    $stazione=$_REQUEST['stazione'];
    $produzioneNegliAnniFilter=json_decode($_REQUEST['JSONproduzioneNegliAnniFilter'],true);

    $data=[];

    if($produzioneNegliAnniFilter["colonna"]=="ordini")
    {
        $query2="SELECT DATEPART(mm, dataOra) AS x, COUNT(ordine) AS y, DATEPART(yy, dataOra) AS anno, stazione
                FROM (SELECT id_registrazione, dataOra, stazione, utente, ordine, chiuso, codiceNonPresente
                                        FROM dbo.registrazioni_produzione AS registrazioni_produzione_1
                                        UNION ALL
                                        SELECT id_registrazione, dataOra, stazione, utente, ordine, chiuso, codiceNonPresente
                                        FROM dbo.registrazioni_produzione_storico) AS registrazioni_produzione
                GROUP BY DATEPART(mm, dataOra), DATEPART(yy, dataOra), stazione
                HAVING (stazione = '$stazione')
                ORDER BY anno, x";	
    }
    else
    {
        $query2="SELECT TOP (100) PERCENT mese AS x, SUM(".$produzioneNegliAnniFilter['colonna'].") AS y, anno, stazione
                FROM (SELECT derivedtbl_1.docnum, derivedtbl_1.mq, derivedtbl_1.basi_portalavabo, derivedtbl_1.basi_accostabili, derivedtbl_1.pensili, derivedtbl_1.colonne, derivedtbl_1.Altro, derivedtbl_1.totale_pezzi, derivedtbl_1.stazione, 
                    DATEPART(mm, dbo.Calendar.[data-]) AS mese, DATEPART(yy, dbo.Calendar.[data-]) AS anno
                    FROM (SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                    FROM dbo.sommario_produzione_montaggio
                    UNION ALL
                    SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                    FROM dbo.sommario_produzione_verniciatura
                    UNION ALL
                    SELECT docnum, mq, basi_portalavabo, basi_accostabili, pensili, colonne, Altro, dataConsegna, totale_pezzi, stazione, settimana, stato
                    FROM dbo.sommario_produzione_punto_punto) AS derivedtbl_1 INNER JOIN
                    dbo.Calendar ON derivedtbl_1.settimana = dbo.Calendar.KW_ID) AS registrazioni_produzione
                GROUP BY mese, anno, stazione
                HAVING (stazione = '$stazione')
                ORDER BY anno, x";
    }

    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $dot['x']=$row2['x'];
            $dot['y']=floatval($row2['y']);
            $dot['anno']=$row2['anno'];
            array_push($data,$dot);
        }
        
        echo json_encode($data);
    }
    else
        die("error".$query2);

?>
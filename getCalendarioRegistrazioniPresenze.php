<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $calendarioRegistrazioni=[];

    $query2="SELECT TOP (100) PERCENT data, COUNT(id_registrazione) AS registrazioni, MIN(chiusa) AS chiuse
            FROM (SELECT TOP (100) PERCENT t_2.data, registrazioni_presenze.id_registrazione, registrazioni_presenze.chiusa
                FROM (SELECT [data-] AS data
                FROM (SELECT dval, KW_ID, dtext, DATUM_ID, [data-]
                FROM dbo.Calendar
                WHERE (DATEPART(yy, [data-]) > 2018)) AS t_1) AS t_2 LEFT OUTER JOIN
                (SELECT id_registrazione, dataInizio, dataFine, utente, descrizione, note, smartWorking, chiusa, CAST(dataInizio AS date) AS dataInizioDate, CAST(dataFine AS date) AS dataFineDate
                FROM dbo.registrazioni_presenze AS registrazioni_presenze_1
                WHERE (utente = $id_utente)) AS registrazioni_presenze ON t_2.data = registrazioni_presenze.dataInizioDate) AS t
            GROUP BY data
            ORDER BY data";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $giornata["data"]=$row2['data'];
            $giornata["registrazioni"]=$row2['registrazioni'];
            $giornata["chiuse"]=$row2['chiuse'];

            array_push($calendarioRegistrazioni,$giornata);
        }

        echo json_encode($calendarioRegistrazioni);
    }
    else
        die("error".$query2)

?>
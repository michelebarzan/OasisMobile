
<?php

    include "connessione.php";

    $ordini=[];

    $query2="SELECT DISTINCT dbo.registrazioni_produzione.ordine FROM dbo.allegati_registrazioni_produzione INNER JOIN dbo.registrazioni_produzione ON dbo.allegati_registrazioni_produzione.registrazione_produzione = dbo.registrazioni_produzione.id_registrazione ORDER BY ordine DESC";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            array_push($ordini,$row2['ordine']);
        }
        echo json_encode($ordini);
    }
    else
        die("error");

?>
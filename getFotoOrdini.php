
<?php

    include "connessione.php";

    $ordini=[];

    $query2="SELECT DISTINCT ordine FROM dbo.view_allegati_registrazioni ORDER BY ordine DESC";	
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
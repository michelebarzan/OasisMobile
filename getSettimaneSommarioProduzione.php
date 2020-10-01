<?php

    include "connessione.php";

    $settimane=[];

    $query2="SELECT settimana FROM settimane_salvataggi ORDER BY settimana DESC";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==FALSE)
    {
        die("error");
    }
    else
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            array_push($settimane,$row2['settimana']);
        }
    }

    echo json_encode($settimane);

?>
<?php

    include "connessione.php";

    $stazioni=[];

    $query2="SELECT [APLATZ_ID] as stazione FROM [Cecklist].[dbo].[Stazioni]";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==FALSE)
    {
        die("error");
    }
    else
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            array_push($stazioni,$row2['stazione']);
        }
    }
    $query1="SELECT stazione FROM stazioni_aggiuntive";	
    $result1=sqlsrv_query($conn,$query1);
    if($result1==FALSE)
    {
        die("error");
    }
    else
    {
        while($row1=sqlsrv_fetch_array($result1))
        {
            array_push($stazioni,$row1['stazione']);
        }
    }

    echo json_encode($stazioni);

?>
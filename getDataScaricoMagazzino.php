<?php

    include "connessione.php";

    $code=$_REQUEST['code'];

    $itemName = "";

    $q="SELECT ItemName FROM Oasis_Live.dbo.OITM WHERE ItemCode = '$code'";
    $r=sqlsrv_query($conn,$q);
    if($r==TRUE)
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $itemName=$row["ItemName"];
        }
    }
    else
        die("error");
        
    echo json_encode($itemName);
    
?>
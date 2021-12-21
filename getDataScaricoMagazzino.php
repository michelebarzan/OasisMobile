<?php

    include "connessione.php";

    $code=$_REQUEST['code'];

    $itemName;

    $q="SELECT ItemName FROM TEST_FE_Oasis_Live.dbo.OITM WHERE ItemCode = '$code'";

    $r=sqlsrv_query($conn,$q);
    if($r==TRUE)
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $itemName=$row["ItemName"];
        }
        
        echo json_encode($itemName);
    }
    else
        die("error");

?>
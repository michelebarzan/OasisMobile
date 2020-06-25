
<?php

    include "connessione.php";

    $id_share=$_REQUEST["id_share"];

    $query2="SELECT src FROM share_cloud_foto WHERE id_share=$id_share";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            echo $row2['src'];
        }
    }
    else
        die("error0".$query2);

?>
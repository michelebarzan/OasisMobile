
<?php

    include "connessione.php";

    $cartella=$_REQUEST["cartella"];

    $query2="SELECT id_cartella FROM dbo.cartelle_cloud_foto WHERE cartella='$cartella'";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            echo $row2['id_cartella'];
        }
    }
    else
        die("error");

?>
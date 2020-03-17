
<?php

    include "connessione.php";

    $id_cartella=$_REQUEST["id_cartella"];

    $query2="SELECT distinct cartella FROM dbo.cartelle_cloud_foto WHERE id_cartella=$id_cartella";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            /*Per qulache motivo compare un a capo difronte a $row2["cartella"]
            echo $row2["cartella"];*/
            $cartella = $row2["cartella"];
            echo json_encode($cartella);
        }
    }
    else
        die("error0".$query2);

?>
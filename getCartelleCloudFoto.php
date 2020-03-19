
<?php

    include "connessione.php";
    include "commonGetCloudFoto.php";

    $id_cartella=$_REQUEST["id_cartella"];

    $server=$_SERVER["SERVER_NAME"];

    $cartelle=[];

    $query2="SELECT * FROM dbo.cartelle_cloud_foto WHERE cartella_padre=$id_cartella";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $cartella["id_cartella"]=$row2['id_cartella'];
            $cartella["cartella"]=$row2['cartella'];
            $cartella["cartella_padre"]=$row2['cartella_padre'];
            $cartella["dataOra"]=$row2['dataOra'];
            $cartella["descrizione"]=$row2['descrizione'];
            $cartella["tipo"]='cartella';
            $cartella["server"]=$server;
            $cartella["path"]=getPath($conn,$row2['cartella_padre']).$row2['cartella'];
            array_push($cartelle,$cartella);
        }
        echo json_encode($cartelle);
    }
    else
        die("error");

?>

<?php

    include "connessione.php";

    $id_cartella=$_REQUEST["id_cartella"];

    $contenutoCartella=[];

    $query2="SELECT * FROM dbo.cartelle_cloud_foto WHERE cartella_padre=$id_cartella";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $cartellaFile["id_cartella"]=$row2['id_cartella'];
            $cartellaFile["cartella"]=$row2['cartella'];
            $cartellaFile["cartella_padre"]=$row2['cartella_padre'];
            $cartellaFile["dataOra"]=$row2['dataOra'];
            //$cartellaFile["tipo"]='cartella';
            array_push($contenutoCartella,$cartellaFile);
        }
        echo json_encode($contenutoCartella);
    }
    else
        die("error");

?>
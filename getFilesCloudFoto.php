
<?php

    include "connessione.php";
    include "commonGetCloudFoto.php";

    $id_cartella=$_REQUEST["id_cartella"];

    $server=$_SERVER["SERVER_NAME"];

    $files=[];

    $query2="SELECT * FROM dbo.files_cloud_foto WHERE cartella=$id_cartella";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $file["id_file"]=$row2['id_file'];
            $file["cartella"]=$row2['cartella'];
            $file["nomeFile"]=$row2['nomeFile'];
            $file["dataOra"]=$row2['dataOra'];
            $file["descrizione"]=$row2['descrizione'];
            $file["tipo"]='file';
            $file["server"]=$server;
            $file["path"]=getPath($conn,$row2['cartella']).$row2['nomeFile'];
            array_push($files,$file);
        }
        echo json_encode($files);
    }
    else
        die("error0".$query2);

?>
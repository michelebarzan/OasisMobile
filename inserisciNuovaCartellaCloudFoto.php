<?php

    include "connessione.php";

    $id_utente=$_REQUEST['id_utente'];
    $nomeCartella=$_REQUEST['nomeCartella'];
    $cartella_padre=$_REQUEST['cartella_corrente'];
    $path=$_REQUEST["path"];

    $query2="INSERT INTO [dbo].[cartelle_cloud_foto]
                ([cartella]
                ,[cartella_padre]
                ,[dataOra]
                ,[utente])
            VALUES 
                ('$nomeCartella'
                ,$cartella_padre
                ,GETDATE()
                ,$id_utente)";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $pathString="";
        foreach ($path as $item) 
        {
            if($item["cartella"]!=NULL)
                $pathString.=$item["cartella"]."/";
        }
        mkdir("C:/xampp/htdocs/".$pathString.$nomeCartella);
        //echo "C:/xampp/htdocs/".$pathString.$nomeCartella;
    }
    else
        die("error");
?>
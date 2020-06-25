<?php

    include "connessione.php";

    $JSONfiles=$_REQUEST['JSONfiles'];
    $id_utente=$_REQUEST['id_utente'];

    $query2="INSERT INTO [dbo].[share_cloud_foto] (src,utente) VALUES ('$JSONfiles',$id_utente)";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $query3="SELECT MAX(id_share) AS id_share FROM dbo.share_cloud_foto WHERE utente=$id_utente";	
        $result3=sqlsrv_query($conn,$query3);
        if($result3==TRUE)
        {
            while($row3=sqlsrv_fetch_array($result3))
            {
                echo $row3['id_share'];
            }
        }
        else
            die("error".$query3);
    }
    else
        die("error".$query2);
?>
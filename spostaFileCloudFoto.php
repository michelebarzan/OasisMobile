<?php

    include "connessione.php";

    $oldPathString=$_REQUEST["oldPathString"];
    $newPathString=$_REQUEST["newPathString"];
    $cartella_selezionata=$_REQUEST["cartella_selezionata"];
    $files=json_decode($_REQUEST["JSONfiles"]);

    foreach($files as $JSONfile)
    {
        $file = json_decode(json_encode($JSONfile, true),true);
        if(rename("C:/xampp/htdocs/".$oldPathString.$file['nome'],"C:/xampp/htdocs/".$newPathString.$file['nome'])!==TRUE)
            die("error");
        else
        {
            $query2="UPDATE files_cloud_foto SET cartella=$cartella_selezionata WHERE id_file=".$file['id_file'];	
            $result2=sqlsrv_query($conn,$query2);
            if($result2==FALSE)
                die("error1");
        }
    }

?>
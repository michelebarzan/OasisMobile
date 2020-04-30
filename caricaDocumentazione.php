<?php
	
    include "connessione.php";
    
    $id_utente=$_REQUEST["id_utente"];        
    $fileName=$_REQUEST["fileName"];        
    $nome=$_REQUEST["nome"];        
    $categoria=$_REQUEST["categoria"];        
    $documento=$_FILES["documento"];

    $target_dir="OasisDocumentazione\\pdf.js\\web\\attachment\\";
    $target_file = $target_dir.basename($fileName);
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    
    //define ('SITE_ROOT', realpath(dirname(__FILE__)));
    define ('SITE_ROOT', 'C:\\xampp\\htdocs\\');

    if (move_uploaded_file($documento["tmp_name"], SITE_ROOT.'\\'.$target_file)) 
    {
        $query2="INSERT INTO [dbo].[documentazione]
                    ([nome]
                    ,[utente]
                    ,[dataOra]
                    ,[eliminato]
                    ,[categoria]
                    ,[nomeFile])
                VALUES
                    ('$nome'
                    ,$id_utente
                    ,GETDATE()
                    ,'false'
                    ,'$categoria'
                    ,'".$fileName."')";	
        $result2=sqlsrv_query($conn,$query2);
        if($result2==TRUE)
            echo "ok";
        else
            die("error");
    } 
    else 
    {
        echo "error1";
    }

?>
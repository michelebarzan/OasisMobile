<?php
	
	include "connessione.php";
    
    $cartella=$_POST["cartella_corrente"];
    $id_utente=$_POST["id_utente"];
    $pathString=$_REQUEST["pathString"];

    $fileName=basename($_FILES["file"]["name"]);

    $formato=explode(".",$fileName)[sizeof(explode(".",$fileName))-1];
    if(strtolower($formato)=="mov")
        $fileName=str_ireplace(".MOV",".mp4",$fileName);

    $target_file = "C:/xampp/htdocs/".$pathString.$fileName;
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    
    if (move_uploaded_file($_FILES["file"]["tmp_name"],$target_file)) 
    {
        $query3="DELETE FROM [dbo].[files_cloud_foto] WHERE cartella=$cartella AND nomeFile='$fileName'";
        $result3=sqlsrv_query($conn,$query3);
        if($result3==TRUE)
        {
            $query2="INSERT INTO [dbo].[files_cloud_foto]
                        ([cartella]
                        ,[nomeFile]
                        ,[dataOra]
                        ,[utente])
                    VALUES
                        ($cartella
                        ,'$fileName'
                        ,GETDATE()
                        ,$id_utente)";
            $result2=sqlsrv_query($conn,$query2);
            if($result2==TRUE)
            {
                echo "ok";
            }
            else
                die("error2".$query2);
        }
        else
            die("error3".$query3);
    } 
    else 
    {
        echo "error1";
    }

?>

<?php

    include "connessione.php";

    $id=$_REQUEST["id"];
    $tipo=$_REQUEST["tipo"];
    $pathString=$_REQUEST["pathString"];
    $nome=$_REQUEST["nome"];

    if($tipo=="file")
    {
        $query2="DELETE FROM [files_cloud_foto] WHERE id_file=$id";	
        $result2=sqlsrv_query($conn,$query2);
        if($result2==TRUE)
        {
            unlink("C:/xampp/htdocs/".$pathString.$nome);
            echo "ok";
        }
        else
            die("error1");
    }
    if($tipo=="cartella")
    {
        $query2="DELETE FROM [files_cloud_foto] WHERE cartella=$id";	
        $result2=sqlsrv_query($conn,$query2);
        if($result2==TRUE)
        {
            $query3="DELETE FROM [cartelle_cloud_foto] WHERE cartella_padre=$id";	
            $result3=sqlsrv_query($conn,$query3);
            if($result3==TRUE)
            {
                $query4="DELETE FROM [cartelle_cloud_foto] WHERE id_cartella=$id";	
                $result4=sqlsrv_query($conn,$query4);
                if($result4==TRUE)
                {
                    deleteDir("C:/xampp/htdocs/".$pathString.$nome);
                    echo "ok";
                }
                else
                    die("error");
            }
            else
                die("error");
        }
        else
            die("error");
    }

    function deleteDir($dir) 
    {
        $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new RecursiveIteratorIterator($it,
                    RecursiveIteratorIterator::CHILD_FIRST);
        foreach($files as $file) {
            if ($file->isDir()){
                rmdir($file->getRealPath());
            } else {
                unlink($file->getRealPath());
            }
        }
        rmdir($dir);
    }

?>
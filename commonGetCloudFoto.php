<?php

    function getPath($conn,$id_cartella_padre)
    {
        $path=[$id_cartella_padre];
        do{ 
            $id_cartella_padre=getIdCartellaPadre($conn,$id_cartella_padre);
            if($id_cartella_padre!="0")
                array_push($path,$id_cartella_padre);
        }while($id_cartella_padre!="0");
        $path=array_reverse($path);
        $pathString=[];
        foreach ($path as $id_cartella)
        {
            array_push($pathString,getCartellaById($conn,$id_cartella));
        }
        return implode("/",$pathString)."/";
    }
    function getIdCartellaPadre($conn,$id_cartella)
    {
        $query2="SELECT ISNULL(cartella_padre,0) AS cartella_padre FROM dbo.cartelle_cloud_foto WHERE id_cartella=$id_cartella";	
        $result2=sqlsrv_query($conn,$query2);
        if($result2==TRUE)
        {
            while($row2=sqlsrv_fetch_array($result2))
            {
                return $row2['cartella_padre'];
            }
            return 0;
        }
        else
            return 0;
    }
    function getCartellaById($conn,$id_cartella)
    {
        $query2="SELECT cartella FROM dbo.cartelle_cloud_foto WHERE id_cartella=$id_cartella";	
        $result2=sqlsrv_query($conn,$query2);
        if($result2==TRUE)
        {
            while($row2=sqlsrv_fetch_array($result2))
            {
                return $row2['cartella'];
            }
        }
        else
            return "NULL";
    }
    function getCartellaPadre($conn,$cartella)
    {
        $query2="SELECT cartella FROM dbo.cartelle_cloud_foto WHERE id_cartella=(SELECT cartella_padre FROM dbo.cartelle_cloud_foto WHERE cartella=$cartella)";	
        $result2=sqlsrv_query($conn,$query2);
        if($result2==TRUE)
        {
            while($row2=sqlsrv_fetch_array($result2))
            {
                return $row2['cartella'];
            }
        }
        else
            return "NULL";
    }

?>

<?php

    include "connessione.php";

    $tabella=$_REQUEST["tabella"];
    $valore=$_REQUEST["valore"];
    $colonna=$_REQUEST["colonna"];
    $tipo=$_REQUEST["tipo"];
    $id=$_REQUEST["id"];

    $query2="UPDATE [$tabella] SET [$colonna]='$valore' WHERE [id_$tipo]=$id";echo $query2;	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            echo "ok";
        }
    }
    else
        die("error");

?>
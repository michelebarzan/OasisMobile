<?php

    include "connessione.php";

    $marca=$_REQUEST['marca'];
    $modello=$_REQUEST['modello'];
    $targa=$_REQUEST['targa'];

    $marca=str_replace("'","''",$marca);
    $modello=str_replace("'","''",$modello);

    $query2="INSERT INTO [dbo].[anagrafica_automezzi] ([marca],[modello],[targa]) VALUES ('$marca','$modello','$targa')";
    $result2=sqlsrv_query($conn,$query2);
    if($result2!=TRUE)
        die("error");
?>
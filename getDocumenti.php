<?php

    include "connessione.php";

    $orderBy=$_REQUEST["orderBy"];
    $categoria=$_REQUEST["categoria"];

    $documenti=[];

    $query2="SELECT * FROM dbo.documentazione WHERE eliminato = 'false' AND categoria LIKE '%$categoria%' ORDER BY $orderBy";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $documento["id_documento"]=$row2['id_documento'];
            $documento["nome"]=$row2['nome'];
            $documento["nomeFile"]=$row2['nomeFile'];
            $documento["utente"]=$row2['utente'];
            $documento["dataOra"]=$row2['dataOra'];
            $documento["eliminato"]=$row2['eliminato'];
            $documento["categoria"]=$row2['categoria'];

            array_push($documenti,$documento);
        }
    }
    else
        die("error");

    echo json_encode($documenti);

?>
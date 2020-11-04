<?php

    include "connessione.php";

    $id_registrazione=$_REQUEST["id_registrazione"];
    $dataInizio=$_REQUEST["dataInizio"];
    $dataFine=$_REQUEST["dataFine"];
    $smartWorking=$_REQUEST["smartWorking"];
    $descrizione=str_replace("'","''",$_REQUEST["descrizione"]);
    $note=str_replace("'","''",$_REQUEST["note"]);

    $query2="UPDATE registrazioni_presenze SET dataInizio='$dataInizio', dataFine='$dataFine', smartWorking='$smartWorking', descrizione='$descrizione', note='$note',chiusa='true' WHERE id_registrazione=$id_registrazione";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==FALSE)
        die("error $query2")

?>

<?php

    set_time_limit(3000);

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $shellOutput = shell_exec("robocopy \\\\srv-dati\\produzione\\fotoProduzioneAndroid C:\\xampp\\htdocs\\OasisFotoProduzione\\fotoProduzioneAndroid /S /Z 2>&1");
		
    if (strpos($shellOutput, 'ERRORE') !== false) 
    {
        die("error");
    }
    else
    {
        $query2="INSERT INTO sincronizzazione_foto_ordini (utente,[data]) VALUES ($id_utente,GETDATE())";	
        $result2=sqlsrv_query($conn,$query2);
        if($result2==FALSE)
        {
            die("error");
        }
    }

?>
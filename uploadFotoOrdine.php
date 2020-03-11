<?php
	
	include "connessione.php";
    
    $stazione=$_POST["stazione"];
    $ordine=$_POST["ordine"];

    /*if(!is_dir('\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine))
		mkdir('\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine);
	if(!is_dir('\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine.'/'.$stazione))
		mkdir('\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine.'/'.$stazione);
    
    $target_dir='\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine.'\\'.$stazione.'\\';*/
    if(!is_dir('\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine))
		mkdir('\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine);
	if(!is_dir('\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine.'/'.$stazione))
		mkdir('\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine.'/'.$stazione);
    
    $target_dir='\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine.'\\'.$stazione.'\\';
    $target_file = $target_dir.basename($_FILES["file"]["name"]);
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    
    if (move_uploaded_file($_FILES["file"]["tmp_name"],$target_file)) 
    {
        $query3="INSERT INTO allegati_registrazioni_produzione ([percorso]) VALUES ('//srv-dati/Produzione/FotoProduzioneAndroid/$ordine/+$stazione/".basename($_FILES["file"]["name"])."')";
        $result3=sqlsrv_query($conn,$query3);
        if($result3==FALSE)
        {
            die("error");
        }
        else
        {
            echo "ok";
        }
    } 
    else 
    {
        echo "error";
    }

?>
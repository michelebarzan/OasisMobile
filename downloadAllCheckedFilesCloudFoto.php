<?php

    set_time_limit(90);

    $filesToDownload=json_decode($_REQUEST["JSONfilesToDownload"]);
    $cartella=$_REQUEST["cartella"];
    $id_utente=$_REQUEST["id_utente"];

    $paths="";

    foreach($filesToDownload as $JSONfileToDownload)
    {
        $fileToDownload=json_decode(json_encode($JSONfileToDownload,True),True);
        if($fileToDownload["tipo"]=="file")
            $paths.=' "C:\\xampp\\htdocs\\'.$fileToDownload["path"].$fileToDownload["nome"].'"';
        if($fileToDownload["tipo"]=="cartella")
            $paths.=' "C:\\xampp\\htdocs\\'.$fileToDownload["path"].$fileToDownload["nome"].'"';
    }
    
	$output2 = exec('del "C:\\xampp\\htdocs\\OasisMobile\\files\\cloudFoto\\'.$cartella.'_'.$id_utente.'.rar" 2>&1');
    $output = exec('C:\\xampp\\htdocs\\OasisMobile\\files\\rar a "C:\\xampp\\htdocs\\OasisMobile\\files\\cloudFoto\\'.$cartella.'_'.$id_utente.'"'.$paths.' 2>&1');

    echo $output;

?>
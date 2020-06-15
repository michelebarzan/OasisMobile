<?php

    $src=$_GET["src"];
    $nome=$_GET["nome"];
    $protocol=$_GET["protocol"];
    $server=$_GET["server"];
    $path=$_GET["path"];

    $output = exec('C:\\xampp\\htdocs\\OasisMobile\\files\\rar a "C:\\xampp\\htdocs\\OasisMobile\\files\\cloudFoto\\'.$nome.'" "C:\\xampp\\htdocs\\'.$path.'" 2>&1');

    echo $output;

    /*$file_url = $protocol."//".$server."//OasisMobile//files//cloudFoto//$nome.rar";
    header('Content-Type: application/octet-stream');
    header("Content-Transfer-Encoding: Binary"); 
    header("Content-disposition: attachment; filename=\"" . basename($file_url) . "\""); 
    readfile($file_url); */

?>
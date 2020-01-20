<?php
	
	include "connessione.php";
    
    $username=$_REQUEST["username"];        
    $immagine=$_FILES["immagine"];

    $target_dir="OasisUsersImages\\";
    $target_file = $target_dir.basename("$username.png");
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    
    //define ('SITE_ROOT', realpath(dirname(__FILE__)));
    define ('SITE_ROOT', 'C:\\xampp\\htdocs\\');

    if (move_uploaded_file($immagine["tmp_name"], SITE_ROOT.'\\'.$target_file)) 
    {
        echo "ok";
    } 
    else 
    {
        echo "error1";
    }

?>
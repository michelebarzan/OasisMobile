<?php

    $oldName=$_REQUEST["oldName"];
    $newName=$_REQUEST["newName"];
    $pathString=$_REQUEST["pathString"];

    if(rename("C:/xampp/htdocs/".$pathString.$oldName,"C:/xampp/htdocs/".$pathString.$newName)!==TRUE)
        die("error");
        

?>
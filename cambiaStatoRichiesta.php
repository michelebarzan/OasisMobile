<?php

    include "connessione.php";

    $id_richiesta=$_REQUEST['id_richiesta'];
    $stato=$_REQUEST['stato'];

    $query2="UPDATE richieste_e_faq SET stato='$stato' WHERE id_richiesta=$id_richiesta";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        echo "ok";
    }
    else
        echo "error";

?>
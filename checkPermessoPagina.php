<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];
    $nomePagina=$_REQUEST["nomePagina"];

    $q="SELECT permesso FROM permessi_pagine,elenco_pagine WHERE permessi_pagine.pagina=elenco_pagine.id_pagina AND utente=$id_utente AND nomePagina='$nomePagina'";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $rows = sqlsrv_has_rows( $r );
        if ($rows === true)
        {
            while($row=sqlsrv_fetch_array($r))
            {
                if($row['permesso']=='completo')
                    echo "true";
                else
                    echo "false";
            }
        }
        else
            echo "false";
    }

?>
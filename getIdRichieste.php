<?php

    include "connessione.php";

    $stati=json_decode($_REQUEST["JSONstati"]);
    $macrocategorie=json_decode($_REQUEST["JSONmacrocategorie"]);
    $utenti=json_decode($_REQUEST["JSONutenti"]);

    $stati_in="'".implode("','",$stati)."'";
    $macrocategorie_in=implode(",",$macrocategorie);
    $utenti_in=implode(",",$utenti);

    set_time_limit(240);

    $id_richieste=[];

    $query1="SELECT id_richiesta FROM richieste_e_faq WHERE stato IN ($stati_in) AND macrocategoria IN ($macrocategorie_in) AND utente_creazione IN ($utenti_in) OPTION ( QUERYTRACEON 9481 )";	
    $result1=sqlsrv_query($conn,$query1);
    if($result1==FALSE)
    {
        die("error1");
    }
    else
    {
        while($row=sqlsrv_fetch_array($result1))
        {
            array_push($id_richieste,$row["id_richiesta"]);
        }
    }

    echo json_encode($id_richieste);

?>
<?php

    include "connessione.php";

    /*$stati=json_decode($_REQUEST["JSONstati"]);
    $macrocategorie=json_decode($_REQUEST["JSONmacrocategorie"]);
    $utenti=json_decode($_REQUEST["JSONutenti"]);
    $id_utente=$_REQUEST["id_utente"];

    $stati_in="'".implode("','",$stati)."'";
    $macrocategorie_in=implode(",",$macrocategorie);
    $utenti_in=implode(",",$utenti);

    set_time_limit(240);

    $id_richieste=[];

    $query1="SELECT id_richiesta 
            FROM (SELECT id_richiesta,stato,macrocategoria,utente_creazione
                FROM dbo.richieste_e_faq
                WHERE (id_richiesta IN
                    (SELECT richiesta
                    FROM dbo.utenti_incaricati_richieste
                    WHERE (utente = $id_utente)))
                UNION
                SELECT id_richiesta,stato,macrocategoria,utente_creazione
                FROM dbo.richieste_e_faq
                WHERE (macrocategoria IN
                    (SELECT macrocategoria
                    FROM dbo.utenti_incaricati_macrocategorie
                    WHERE (utente = $id_utente)))) AS deriv 
            WHERE deriv.stato IN ($stati_in) AND deriv.macrocategoria IN ($macrocategorie_in) AND deriv.utente_creazione IN ($utenti_in) OPTION ( QUERYTRACEON 9481 )";	
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

    echo json_encode($id_richieste);*/

    $stati=json_decode($_REQUEST["JSONstati"]);
    $macrocategorie=json_decode($_REQUEST["JSONmacrocategorie"]);
    $id_utente=$_REQUEST["id_utente"];

    $stati_in="'".implode("','",$stati)."'";
    $macrocategorie_in=implode(",",$macrocategorie);

    set_time_limit(240);

    $id_richieste=[];

    $query1="SELECT id_richiesta 
            FROM (SELECT id_richiesta,stato,macrocategoria,utente_creazione
                FROM dbo.richieste_e_faq
                WHERE (id_richiesta IN
                    (SELECT richiesta
                    FROM dbo.utenti_incaricati_richieste
                    WHERE (utente = $id_utente)))
                UNION
                SELECT id_richiesta,stato,macrocategoria,utente_creazione
                FROM dbo.richieste_e_faq
                WHERE (macrocategoria IN
                    (SELECT macrocategoria
                    FROM dbo.utenti_incaricati_macrocategorie
                    WHERE (utente = $id_utente)))) AS deriv 
            WHERE deriv.stato IN ($stati_in) AND deriv.macrocategoria IN ($macrocategorie_in) OPTION ( QUERYTRACEON 9481 )";	
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
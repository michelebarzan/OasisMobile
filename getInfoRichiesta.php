<?php

    include "connessione.php";

    $id_richiesta=$_REQUEST["id_richiesta"];

    set_time_limit(240);

    $query1="SELECT dbo.richieste_e_faq.*, dbo.utenti.username, dbo.macrocategorie_richieste.nome AS nome_macrocategoria
            FROM dbo.richieste_e_faq INNER JOIN dbo.utenti ON dbo.richieste_e_faq.utente_creazione = dbo.utenti.id_utente INNER JOIN dbo.macrocategorie_richieste ON dbo.richieste_e_faq.macrocategoria = dbo.macrocategorie_richieste.id_macrocategoria 
            WHERE id_richiesta=$id_richiesta 
            OPTION ( QUERYTRACEON 9481 )";	
    $result1=sqlsrv_query($conn,$query1);
    if($result1==FALSE)
    {
        die("error1");
    }
    else
    {
        while($row=sqlsrv_fetch_array($result1))
        {
            $info_richiesta["id_richiesta"]=$row["id_richiesta"];
            $info_richiesta["oggetto"]=$row["oggetto"];
            $info_richiesta["descrizione"]=$row["oggetto"];
            $info_richiesta["note"]=$row["note"];
            $info_richiesta["id_macrocategoria"]=$row["macrocategoria"];
            $info_richiesta["nome_macrocategoria"]=$row["nome_macrocategoria"];
            $info_richiesta["categoria"]=$row["categoria"];
            $info_richiesta["stato"]=$row["stato"];
            $info_richiesta["data_creazione"]=$row["data_creazione"];
            $info_richiesta["utente_creazione"]=$row["utente_creazione"];
            $info_richiesta["username_utente_creazione"]=$row["username"];
        }
    }

    echo json_encode($info_richiesta);

?>
<?php

    include "connessione.php";

    $macrocategorie=[];

    $query2="SELECT id_macrocategoria, nome, descrizione FROM dbo.macrocategorie_richieste";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            array_push($macrocategorie,$row2['id_macrocategoria']);
        }
    }

    echo json_encode($macrocategorie);

?>
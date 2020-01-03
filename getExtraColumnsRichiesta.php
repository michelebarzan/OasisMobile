<?php

    include "connessione.php";

    $id_macrocategoria=$_REQUEST["id_macrocategoria"];

    set_time_limit(240);

    $extraColumns=[];

    $query1="SELECT colonna,label FROM colonne_richieste_macrocategorie WHERE macrocategoria=$id_macrocategoria";	
    $result1=sqlsrv_query($conn,$query1);
    if($result1==FALSE)
    {
        die("error1");
    }
    else
    {
        while($row=sqlsrv_fetch_array($result1))
        {
            $column["label"]=$row["label"];
            $column["name"]=$row["colonna"];

            array_push($extraColumns,$column);
        }
    }

    echo json_encode($extraColumns);

?>
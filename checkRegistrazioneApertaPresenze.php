<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $query2="SELECT * FROM registrazioni_presenze WHERE utente=$id_utente AND chiusa='false'";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $rows = sqlsrv_has_rows( $result2 );
        if ($rows === true)
        {
            while($row2=sqlsrv_fetch_array($result2))
            {
                $registrazione["id_registrazione"]=$row2['id_registrazione'];
                $registrazione["dataInizio"]=$row2['dataInizio'];
                $registrazione["dataFine"]=$row2['dataFine'];
                $registrazione["dataInizioString"]=$row2['dataInizio']->format("d/m/Y H:i:s");
                if($row2['dataFine']==null)
                    $registrazione["dataFineString"]=null;
                else
                    $registrazione["dataFineString"]=$row2['dataFine']->format("d/m/Y H:i:s");
                $registrazione["dataInizioInputFormat"]=str_replace(" ","T",$row2['dataInizio']->format("Y-m-d H:i"));
                if($row2['dataFine']==null)
                    $registrazione["dataFineInputFormat"]=null;
                else
                    $registrazione["dataFineInputFormat"]=str_replace(" ","T",$row2['dataFine']->format("Y-m-d H:i"));
                $registrazione["descrizione"]=$row2['descrizione'];
                $registrazione["note"]=$row2['note'];
                $registrazione["chiusa"]=$row2['chiusa'];
                $registrazione["utente"]=$row2['utente'];

                echo json_encode($registrazione);
            }
        }
        else
            echo json_encode(false);
    }
    else
        die("error")

?>
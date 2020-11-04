<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];
    $data=$_REQUEST["data"];

    $registrazioni=[];

    $query2="SELECT * FROM registrazioni_presenze WHERE utente=$id_utente AND DATEPART(yy,dataInizio)=DATEPART(yy,'$data') AND DATEPART(mm,dataInizio)=DATEPART(mm,'$data') AND DATEPART(dd,dataInizio)=DATEPART(dd,'$data')";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
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
            $registrazione["smartWorking"]=$row2['smartWorking'];
            $registrazione["chiusa"]=$row2['chiusa'];
            $registrazione["utente"]=$row2['utente'];

            array_push($registrazioni,$registrazione);
        }

        echo json_encode($registrazioni);
    }
    else
        die("error".$query2)

?>
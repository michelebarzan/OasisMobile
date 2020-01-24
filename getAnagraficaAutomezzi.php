<?php

    include "connessione.php";

    $automezzi=[];

    $query2="SELECT * FROM dbo.anagrafica_automezzi";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $automezzo["id_automezzo"]=$row2['id_automezzo'];
            $automezzo["marca"]=$row2['marca'];
            $automezzo["modello"]=$row2['modello'];
            $automezzo["targa"]=$row2['targa'];

            array_push($automezzi,$automezzo);
        }
    }

    echo json_encode($automezzi);

?>
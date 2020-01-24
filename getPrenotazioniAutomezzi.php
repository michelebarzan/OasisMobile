<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $prenotazioni=[];

    $query2="SELECT dbo.prenotazioni_automezzi.id_prenotazione, dbo.prenotazioni_automezzi.data_prenotazione, dbo.utenti.username, dbo.anagrafica_automezzi.marca, dbo.anagrafica_automezzi.modello, dbo.anagrafica_automezzi.targa,  dbo.prenotazioni_automezzi.stato, dbo.prenotazioni_automezzi.note, dbo.prenotazioni_automezzi.km_consegna, dbo.prenotazioni_automezzi.data_consegna
            FROM dbo.prenotazioni_automezzi INNER JOIN dbo.utenti ON dbo.prenotazioni_automezzi.utente_prenotazione = dbo.utenti.id_utente INNER JOIN dbo.anagrafica_automezzi ON dbo.prenotazioni_automezzi.veicolo = dbo.anagrafica_automezzi.id_automezzo WHERE utente_apertura=$id_utente ORDER BY data_prenotazione DESC";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $prenotazione["id_prenotazione"]=$row2['id_prenotazione'];
            $prenotazione["data_prenotazione"]=$row2['data_prenotazione']->format("d/m/Y h:i:s");
            $prenotazione["username"]=$row2['username'];
            $prenotazione["marca"]=$row2['marca'];
            $prenotazione["modello"]=$row2['modello'];
            $prenotazione["targa"]=$row2['targa'];

            $query3="SELECT indirizzo FROM destinazioni_prenotazioni_automezzi WHERE prenotazione=".$row2['id_prenotazione'];
            $result3=sqlsrv_query($conn,$query3);
            if($result3==TRUE)
            {
                $destinazioni=[];
                while($row3=sqlsrv_fetch_array($result3))
                {
                    array_push($destinazioni,$row3['indirizzo']);
                }
                $prenotazione["destinazioni"]=$destinazioni;
            }
            else
                die("error");

            $prenotazione["stato"]=$row2['stato'];
            $prenotazione["note"]=$row2['note'];
            $prenotazione["km_consegna"]=$row2['km_consegna'];
            $prenotazione["data_consegna"]="";
            if($row2['data_consegna']!=NULL)
                $prenotazione["data_consegna"]=$row2['data_consegna']->format("d/m/Y h:i:s");

            array_push($prenotazioni,$prenotazione);
        }
        echo json_encode($prenotazioni);
    }
    else
        die("error")

?>
<?php

    include "connessione.php";

    $veicolo=$_REQUEST['veicolo'];
    $id_utente=$_REQUEST['id_utente'];
    $utente=$_REQUEST['utente'];
    $data_prenotazione=$_REQUEST['data_prenotazione'];
    $ora_prenotazione=$_REQUEST['ora_prenotazione'];
    $destinazioni=json_decode($_REQUEST['JSONdestinazioni']);

    $query2="INSERT INTO [dbo].[prenotazioni_automezzi]
            ([utente_apertura]
            ,[data_apertura]
            ,[data_prenotazione]
            ,[utente_prenotazione]
            ,[veicolo]
            ,[stato])
            VALUES
            ($id_utente
            ,GETDATE()
            ,'$data_prenotazione $ora_prenotazione'
            ,$utente
            ,$veicolo
            ,'open')";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $query3="SELECT MAX(id_prenotazione) AS id_prenotazione FROM [prenotazioni_automezzi] WHERE utente_apertura=$id_utente";	
        $result3=sqlsrv_query($conn,$query3);
        if($result3==FALSE)
        {
            die("error");
        }
        else
        {
            while($row3=sqlsrv_fetch_array($result3))
            {
                $id_prenotazione = $row3['id_prenotazione'];
                foreach ($destinazioni as $destinazione)
                {
                    $query4="INSERT INTO [dbo].[destinazioni_prenotazioni_automezzi] ([indirizzo],[prenotazione]) VALUES ('$destinazione',$id_prenotazione)";	
                    $result4=sqlsrv_query($conn,$query4);
                    if($result4==FALSE)
                    {
                        die("error");
                    }
                }
                
                echo $id_prenotazione;
            }
        }
    }
    else
        die("error");
?>
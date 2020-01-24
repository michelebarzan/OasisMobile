<?php

    include "connessione.php";

    $id_utente=$_REQUEST['id_utente'];
    $note=$_REQUEST['note'];
    $km_consegna=$_REQUEST['km_consegna'];
    $id_prenotazione=$_REQUEST['id_prenotazione'];
    $data_consegna=$_REQUEST['data_consegna'];
    $ora_consegna=$_REQUEST['ora_consegna'];

    $note=str_replace("'","''",$note);

    $query2="UPDATE [dbo].[prenotazioni_automezzi] SET stato='close',data_consegna='$data_consegna $ora_consegna' , note='$note', km_consegna='$km_consegna', utente_chiusura=$id_utente, data_chiusura=GETDATE() WHERE id_prenotazione=$id_prenotazione";
    $result2=sqlsrv_query($conn,$query2);
    if($result2!=TRUE)
        die("error");
    else
    {
        $query3="SELECT max(id_prenotazione) AS id_prenotazione FROM dbo.prenotazioni_automezzi WHERE utente_apertura=$id_utente AND stato='open'";	
        $result3=sqlsrv_query($conn,$query3);
        if($result3==TRUE)
        {
            $rows = sqlsrv_has_rows( $result3 );
            if ($rows === true)
            {
                while($row3=sqlsrv_fetch_array($result3))
                {
                    echo $row3['id_prenotazione'];
                }
            }
        }
        else
            die("error");
    }
?>
<?php

    include "connessione.php";

    $username=$_REQUEST['username'];
    $id_utente=$_REQUEST['id_utente'];
    $descrizione=$_REQUEST['descrizione'];
    $id_richiesta=$_REQUEST['id_richiesta'];

    $descrizione=str_replace("'","''",$descrizione);
    $descrizione=str_replace("à","a",$descrizione);
    $descrizione=str_replace("è","e",$descrizione);
    $descrizione=str_replace("ì","i",$descrizione);
    $descrizione=str_replace("ò","o",$descrizione);
    $descrizione=str_replace("ù","u",$descrizione);
    $descrizione=str_replace("€","eur",$descrizione);

    $query2="INSERT INTO [dbo].[risposte_richieste_e_faq]
    ([richiesta]
    ,[descrizione]
    ,[data_risposta]
    ,[utente_risposta]) VALUES ($id_richiesta,'$descrizione',GETDATE(),".$id_utente.")";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $query3="SELECT * FROM [risposte_richieste_e_faq] WHERE utente_risposta=".$id_utente." AND id_risposta=(SELECT MAX(id_risposta) FROM risposte_richieste_e_faq WHERE utente_risposta=".$id_utente.")";	
        $result3=sqlsrv_query($conn,$query3);
        if($result3==FALSE)
        {
            die("error");
        }
        else
        {
            while($row3=sqlsrv_fetch_array($result3))
            {
                echo $row3['id_risposta']."|".$row3['data_risposta']->format('d/m/Y H:i:s')."|".$username;
            }
        }
    }
    else
        die("error");
?>
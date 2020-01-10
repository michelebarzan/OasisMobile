<?php
	
	include "connessione.php";
    
    $utentiSelezionati=json_decode($_REQUEST["JSONutentiSelezionati"]);
    $id_richiesta=$_REQUEST["id_richiesta"];
    
    
    $query2="DELETE FROM utenti_incaricati_richieste WHERE richiesta=$id_richiesta";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        foreach($utentiSelezionati as $id_utente)
        {
            $query1="SELECT * FROM utenti_incaricati_macrocategorie WHERE utente=$id_utente AND macrocategoria = (SELECT macrocategoria FROM richieste_e_faq WHERE id_richiesta=$id_richiesta)";
            $result1=sqlsrv_query($conn,$query1);
            if($result1==FALSE)
            {
                die("error");
            }
            else
            {
                $rows = sqlsrv_has_rows( $result1 );
                if ($rows === true)
                {
                    
                }
                else 
                {
                    $query3="INSERT INTO [dbo].[utenti_incaricati_richieste] ([utente],[richiesta]) VALUES ($id_utente,$id_richiesta)";
                    $result3=sqlsrv_query($conn,$query3);
                    if($result3==FALSE)
                        die("error2");
                }
            }
        }
        echo "ok";
    }
    else
        die("error3");

?>
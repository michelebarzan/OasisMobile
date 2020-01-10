<?php

    include "connessione.php";

    $id_richiesta=$_REQUEST["id_richiesta"];

    set_time_limit(240);

    $query1="SELECT dbo.richieste_e_faq.*, dbo.utenti.username, dbo.macrocategorie_richieste.nome AS nome_macrocategoria, dbo.categorie_richieste.nome AS nome_categoria
            FROM dbo.richieste_e_faq INNER JOIN
                dbo.utenti ON dbo.richieste_e_faq.utente_creazione = dbo.utenti.id_utente INNER JOIN
                dbo.macrocategorie_richieste ON dbo.richieste_e_faq.macrocategoria = dbo.macrocategorie_richieste.id_macrocategoria INNER JOIN
                dbo.categorie_richieste ON dbo.richieste_e_faq.categoria = dbo.categorie_richieste.id_categoria
            WHERE id_richiesta=$id_richiesta 
            OPTION ( QUERYTRACEON 9481 )";	
    $result1=sqlsrv_query($conn,$query1);
    if($result1==FALSE)
    {
        die("error1");
    }
    else
    {
        while($row=sqlsrv_fetch_array($result1))
        {
            $risposte=[];
            $utenti_coinvolti=[];
            $allegati=[];

            $info_richiesta["id_richiesta"]=$row["id_richiesta"];
            $info_richiesta["oggetto"]=utf8_encode($row["oggetto"]);
            $info_richiesta["descrizione"]=utf8_encode($row["descrizione"]);
            $info_richiesta["note"]=utf8_encode($row["note"]);
            $info_richiesta["id_macrocategoria"]=$row["macrocategoria"];
            $info_richiesta["nome_macrocategoria"]=$row["nome_macrocategoria"];
            $info_richiesta["categoria"]=$row["categoria"];
            $info_richiesta["nome_categoria"]=$row["nome_categoria"];
            $info_richiesta["stato"]=$row["stato"];
            $info_richiesta["data_creazione"]=$row["data_creazione"];
            $info_richiesta["utente_creazione"]=$row["utente_creazione"];
            $info_richiesta["username_utente_creazione"]=$row["username"];

            $query4="SELECT dbo.risposte_richieste_e_faq.id_risposta, dbo.risposte_richieste_e_faq.richiesta, dbo.risposte_richieste_e_faq.descrizione, dbo.risposte_richieste_e_faq.data_risposta, dbo.risposte_richieste_e_faq.utente_risposta,  dbo.utenti.username
                    FROM dbo.risposte_richieste_e_faq INNER JOIN dbo.utenti ON dbo.risposte_richieste_e_faq.utente_risposta = dbo.utenti.id_utente WHERE richiesta=".$row['id_richiesta']."
                    ORDER BY data_risposta";	
            $result4=sqlsrv_query($conn,$query4);
            if($result4==FALSE)
            {
                die("error1");
            }
            else
            {
                while($row4=sqlsrv_fetch_array($result4))
                {
                    $allegati_risposta=[];

                    $risposta["id_risposta"]=$row4["id_risposta"];
                    $risposta["data_risposta"]=$row4["data_risposta"];
                    $risposta["username_utente_risposta"]=$row4["username"];
                    $risposta["descrizione"]=utf8_encode($row4["descrizione"]);

                    $query7="SELECT id_allegato, percorso
                            FROM dbo.allegati_risposte_richieste_e_faq
                            WHERE (risposta = ".$row4['id_risposta'].")";	
                    $result7=sqlsrv_query($conn,$query7);
                    if($result7==FALSE)
                    {
                        die("error1");
                    }
                    else
                    {
                        while($row7=sqlsrv_fetch_array($result7))
                        {
                            $allegato_risposta["id_allegato"]=$row7["id_allegato"];
                            $allegato_risposta["percorso"]=$row7["percorso"];

                            array_push($allegati_risposta,$allegato_risposta);
                        }
                    }

                    $risposta["allegati"]=$allegati_risposta;

                    array_push($risposte,$risposta);
                }
                $info_richiesta["risposte"]=$risposte;
            }

            $query5="SELECT dbo.utenti_incaricati_macrocategorie.id_utente_incaricato, dbo.utenti.username,utenti.id_utente,'true' AS disabilitato
                    FROM dbo.utenti_incaricati_macrocategorie INNER JOIN dbo.utenti ON dbo.utenti_incaricati_macrocategorie.utente = dbo.utenti.id_utente
                    WHERE (dbo.utenti_incaricati_macrocategorie.macrocategoria = ".$row['macrocategoria'].")
                    UNION ALL
                    SELECT dbo.utenti_incaricati_richieste.id_utente_incaricato, dbo.utenti.username,utenti.id_utente,'false' AS disabilitato
                    FROM dbo.utenti_incaricati_richieste INNER JOIN dbo.utenti ON dbo.utenti_incaricati_richieste.utente = dbo.utenti.id_utente
                    WHERE (dbo.utenti_incaricati_richieste.richiesta = ".$row['id_richiesta'].")";	
            $result5=sqlsrv_query($conn,$query5);
            if($result5==FALSE)
            {
                die("error1");
            }
            else
            {
                while($row5=sqlsrv_fetch_array($result5))
                {
                    $utente["id_utente_incaricato"]=$row5["id_utente_incaricato"];
                    $utente["id_utente"]=$row5["id_utente"];
                    $utente["username"]=$row5["username"];
                    $utente["disabilitato"]=$row5["disabilitato"];

                    array_push($utenti_coinvolti,$utente);
                }
                $info_richiesta["utenti_coinvolti"]=$utenti_coinvolti;
            }

            $query6="SELECT id_allegato, percorso
                    FROM dbo.allegati_richieste
                    WHERE (richiesta = ".$row['id_richiesta'].")";	
            $result6=sqlsrv_query($conn,$query6);
            if($result6==FALSE)
            {
                die("error1");
            }
            else
            {
                while($row6=sqlsrv_fetch_array($result6))
                {
                    $allegato["id_allegato"]=$row6["id_allegato"];
                    $allegato["percorso"]=$row6["percorso"];

                    array_push($allegati,$allegato);
                }
                $info_richiesta["allegati"]=$allegati;
            }

            $query2="SELECT * FROM colonne_richieste_macrocategorie WHERE macrocategoria=".$row['macrocategoria'];	
            $result2=sqlsrv_query($conn,$query2);
            if($result2==FALSE)
            {
                die("error1");
            }
            else
            {
                while($row2=sqlsrv_fetch_array($result2))
                {
                    if($row2["valori_from_query"]=='false')
                        $info_richiesta[$row2["colonna"]]=$row[$row2["colonna"]];
                    else
                    {
                        $subQuery=explode("ORDER BY",$row2['query_valori'])[0];
                        $query3="SELECT [".$row2['valori_label_column']."] AS result FROM (".$subQuery.") AS query_valori WHERE [".$row2['valori_value_column']."]='".$row[$row2['colonna']]."'"; 
                        $result3=sqlsrv_query($conn,$query3);
                        if($result3==FALSE)
                        {
                            die("error1\n");
                        }
                        else
                        {
                            while($row3=sqlsrv_fetch_array($result3))
                            {
                                $info_richiesta[$row2["colonna"]]=$row3["result"];
                            }
                        }
                    }
                }
            }
        }
    }

    echo json_encode($info_richiesta);

?>
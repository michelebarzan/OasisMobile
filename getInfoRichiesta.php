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
                    $risposta["id_risposta"]=$row4["id_risposta"];
                    $risposta["data_risposta"]=$row4["data_risposta"];
                    $risposta["username_utente_risposta"]=$row4["username"];
                    $risposta["descrizione"]=utf8_encode($row4["descrizione"]);

                    array_push($risposte,$risposta);
                }
                $info_richiesta["risposte"]=$risposte;
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
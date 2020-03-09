
<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];

    $pagine_preferite=[];
    $sezioni=[];

    $qPreferiti="SELECT dbo.pagine_preferite_utenti.id_pagina_preferita_utente, dbo.pagine_preferite_utenti.utente, dbo.elenco_pagine.*, dbo.elenco_pagine.descrizione AS descrizionePagina
                FROM dbo.pagine_preferite_utenti INNER JOIN
                dbo.elenco_pagine ON dbo.pagine_preferite_utenti.pagina = dbo.elenco_pagine.id_pagina
                WHERE (dbo.pagine_preferite_utenti.utente = ".$id_utente.") AND (dbo.elenco_pagine.mobile = 'true') AND (dbo.elenco_pagine.applicazione = 'OasisMobile')";
    $rPreferiti=sqlsrv_query($conn,$qPreferiti);
    if($rPreferiti==FALSE)
    {
        echo "error".$qPreferiti;
    }
    else
    {
        while($rowPreferiti=sqlsrv_fetch_array($rPreferiti))
        {
            $id_pagina=$rowPreferiti['id_pagina'];
            $fileName=$rowPreferiti['fileName'];
            $pagina=$rowPreferiti['pagina'];
            $nomePagina=$rowPreferiti['nomePagina'];
            $descrizionePagina=$rowPreferiti['descrizionePagina'];
            $icona=$rowPreferiti['icona'];
            $id_pagina_preferita_utente=$rowPreferiti['id_pagina_preferita_utente'];

            $obj_pagina['id_pagina']=$id_pagina;
            $obj_pagina['pagina']=$pagina;
            $obj_pagina['nomePagina']=$nomePagina;
            $obj_pagina['descrizionePagina']=$descrizionePagina;
            $obj_pagina['icona']=$icona;
            $obj_pagina['fileName']=$fileName;
            $obj_pagina['id_pagina_preferita_utente']=$id_pagina_preferita_utente;

            array_push($pagine_preferite,$obj_pagina);
        }
    }

    $qSezioni="SELECT [id_sezione],[sezione],[descrizione] FROM [Cecklist].[dbo].[elenco_sezioni] ORDER BY id_sezione";
    $rSezioni=sqlsrv_query($conn,$qSezioni);
    if($rSezioni==FALSE)
    {
        echo "error";
    }
    else
    {
        while($rowSezioni=sqlsrv_fetch_array($rSezioni))
        {
            $id_sezione=$rowSezioni['id_sezione'];
            $sezione=$rowSezioni['sezione'];
            $descrizione=$rowSezioni['descrizione'];
            $pagine_sezioni=[];
            $qPagine="SELECT * FROM elenco_pagine WHERE sezione=$id_sezione AND applicazione='OasisMobile' AND (dbo.elenco_pagine.mobile = 'true') AND id_pagina NOT IN (SELECT dbo.elenco_pagine.id_pagina FROM dbo.pagine_preferite_utenti INNER JOIN dbo.elenco_pagine ON dbo.pagine_preferite_utenti.pagina = dbo.elenco_pagine.id_pagina WHERE (dbo.pagine_preferite_utenti.utente = ".$id_utente.") AND (dbo.elenco_pagine.applicazione = 'OasisMobile'))";
            $rPagine=sqlsrv_query($conn,$qPagine);
            if($rPagine==FALSE)
            {
                echo "error";
            }
            else
            {
                $rowsPagine = sqlsrv_has_rows( $rPagine );
                if ($rowsPagine === true)
                {
                    $obj_sezione['id_sezione']=$id_sezione;
                    $obj_sezione['sezione']=$sezione;
                    $obj_sezione['descrizione']=$descrizione;
                    while($rowPagine=sqlsrv_fetch_array($rPagine))
                    {
                        $id_pagina=$rowPagine['id_pagina'];
                        $pagina=$rowPagine['pagina'];
                        $fileName=$rowPagine['fileName'];
                        $nomePagina=$rowPagine['nomePagina'];
                        $descrizionePagina=$rowPagine['descrizione'];
                        $icona=$rowPagine['icona'];

                        $obj_pagina['id_pagina']=$id_pagina;
                        $obj_pagina['fileName']=$fileName;
                        $obj_pagina['pagina']=$pagina;
                        $obj_pagina['nomePagina']=$nomePagina;
                        $obj_pagina['descrizionePagina']=$descrizionePagina;
                        $obj_pagina['icona']=$icona;

                        array_push($pagine_sezioni,$obj_pagina);
                    }
                    $obj_sezione['pagine']=$pagine_sezioni;
                    array_push($sezioni,$obj_sezione);
                }
            }
        }
    }

    $response=[];
    array_push($response,json_encode($pagine_preferite));
    array_push($response,json_encode($sezioni));

    echo json_encode($response);

?>
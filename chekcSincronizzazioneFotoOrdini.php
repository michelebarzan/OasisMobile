
<?php

    set_time_limit(240);

    include "connessione.php";

    $missingFolders=[];

    $query2="SELECT DISTINCT TOP (100) PERCENT dbo.registrazioni_produzione.ordine, dbo.registrazioni_produzione.stazione, dbo.allegati_registrazioni_produzione.percorso, dbo.allegati_registrazioni_produzione.id_allegato
			FROM dbo.allegati_registrazioni_produzione INNER JOIN dbo.registrazioni_produzione ON dbo.allegati_registrazioni_produzione.registrazione_produzione = dbo.registrazioni_produzione.id_registrazione
			ORDER BY dbo.registrazioni_produzione.ordine DESC";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $ordine=$row2['ordine'];
            $stazione=$row2['stazione'];
            if(!is_dir('\\\\srv-dati\\Produzione\\FotoProduzioneAndroid\\'.$ordine.'/'.$stazione))
            {
				/*$query3="DELETE FROM dbo.allegati_registrazioni_produzione WHERE id_allegato=".$row2['id_allegato'];	
				$result3=sqlsrv_query($conn,$query3);*/
            }
			if(!is_dir('C:\\xampp\\htdocs\\OasisFotoProduzione\\FotoProduzioneAndroid\\'.$ordine.'/'.$stazione))
            {
                $missingFolder["ordine"]=$ordine;
                $missingFolder["stazione"]=$stazione;
                array_push($missingFolders,$missingFolder);
            }
        }
        echo json_encode($missingFolders);
    }
    else
        die("error1");

?>
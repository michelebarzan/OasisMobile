
<?php

include "connessione.php";

$ordine=$_REQUEST['ordine'];

$stazioniOrdine=[];

$query2="SELECT DISTINCT dbo.registrazioni_produzione.ordine, dbo.registrazioni_produzione.stazione FROM dbo.allegati_registrazioni_produzione INNER JOIN dbo.registrazioni_produzione ON dbo.allegati_registrazioni_produzione.registrazione_produzione = dbo.registrazioni_produzione.id_registrazione WHERE ordine='$ordine'";	
$result2=sqlsrv_query($conn,$query2);
if($result2==TRUE)
{
    while($row2=sqlsrv_fetch_array($result2))
    {
        array_push($stazioniOrdine,$row2['stazione']);
    }
    echo json_encode($stazioniOrdine);
}
else
    die("error");

?>
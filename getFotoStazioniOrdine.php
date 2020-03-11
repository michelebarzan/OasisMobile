
<?php

include "connessione.php";

$ordine=$_REQUEST['ordine'];

$stazioniOrdine=[];

$query2="SELECT DISTINCT stazione FROM dbo.view_allegati_registrazioni WHERE ordine='$ordine'";	
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
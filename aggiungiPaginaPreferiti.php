
<?php

include "Session.php";
include "connessione.php";

$id_pagina=$_REQUEST['id_pagina'];
$id_utente=$_REQUEST['id_utente'];

$qPreferiti="INSERT INTO [dbo].[pagine_preferite_utenti] ([pagina],[utente]) VALUES ($id_pagina,".$id_utente.")";
$rPreferiti=sqlsrv_query($conn,$qPreferiti);

?>
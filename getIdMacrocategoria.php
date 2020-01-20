
<?php

include "connessione.php";

$id_richiesta=$_REQUEST["id_richiesta"];

$query2="SELECT macrocategoria FROM dbo.richieste_e_faq WHERE id_richiesta=$id_richiesta";	
$result2=sqlsrv_query($conn,$query2);
if($result2==TRUE)
{
    while($row2=sqlsrv_fetch_array($result2))
    {
        echo $row2['macrocategoria'];
    }
}
?>
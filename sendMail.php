<?php

    include "connessione.php";

    $mails=json_decode($_REQUEST['JSONmails']);
    $subject=$_REQUEST['subject'];
    $body=$_REQUEST['body'];

    set_time_limit(240);

    $query5="DELETE FROM [dbo].[InvioMail]";	
    $result5=sqlsrv_query($conn,$query5);
    if($result5==TRUE)
    {
        $query4="INSERT INTO [dbo].[InvioMail] ([Mail1],[Subject],[Body]) VALUES ('$mails','$subject','$body')";	
        $result4=sqlsrv_query($conn,$query4);
        if($result4==TRUE)
        {
			exec('"C:\Oasis_mail\invio.bat"');
			die("ok");
        }
        else
            die("error");
    }
    else
        die("error");
?>
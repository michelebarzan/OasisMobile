<?php

	include "connessione.php";
	
    $username= $_REQUEST ['username'];
    $password_plain=$_REQUEST ['password'];
    $password=sha1($_REQUEST ['password']);
    $new_password_plain=$_REQUEST ['new_password'];
    $new_password=sha1($_REQUEST ['new_password']);

    $error=true;

    $q2="SELECT * FROM utenti";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error");
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            if($row2['username']==$username)
			{
				if($row2['password']==$password)
				{
                    $error=false;
                    break;
				}
			}
        }
        if($error)
        {
            echo "ko";
        }
        else
        {
            $q3="UPDATE utenti SET [password]='$new_password' WHERE id_utente=".$row2['id_utente'];
            $r3=sqlsrv_query($conn,$q3);
            if($r3==FALSE)
            {
                die("error");
            }
            else
            {
                echo "ok";
            }
        }
    }

?>
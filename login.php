<?php

	include "connessione.php";
	
    $username= $_REQUEST ['username'];
    $password_plain=$_REQUEST ['password'];
    $password=sha1($_REQUEST ['password']);
    $ricorda= $_REQUEST ['ricorda'];

    $error=true;

    $q2="SELECT * FROM utenti";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            if($row2['username']==$username)
			{
				if($row2['password']==$password)
				{
					if($ricorda=='true')
					{
						$hour = time() + 3600 * 24 * 30;
                        setcookie('username', $username, $hour);
                        setcookie('id_utente', $row2['id_utente'], $hour);
                        setcookie('password', $password_plain, $hour);
					}
					else
					{
						$hour = time() + 3600 * 24 * 30;
                        setcookie('username',null, $hour);
                        setcookie('id_utente', null, $hour);
                        setcookie('password', null, $hour);
					}
					session_start();
					$_SESSION['username']=$username;
					$_SESSION['id_utente']=$row2['id_utente'];
					
					echo "ok";
					$error=false;
					break;
				}
			}
        }
        if($error)
        {
            echo "ko";
        }
    }

?>
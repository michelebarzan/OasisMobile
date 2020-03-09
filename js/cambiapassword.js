function changePassword(button)
{
    var error=false;

    document.getElementById("username").style.borderBottomColor="gray";
    document.getElementById("password").style.borderBottomColor="gray";
    document.getElementById("new_password").style.borderBottomColor="gray";
    document.getElementById("confirm_password").style.borderBottomColor="gray";
    document.getElementById("error-container").innerHTML="";
    $("#error-container").hide("fast","swing");

    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    var new_password=document.getElementById("new_password").value;
    var confirm_password=document.getElementById("confirm_password").value;

    if(username=="")
    {
        error=true;

        document.getElementById("username").style.borderBottomColor="#DA6969";
    }
    if(password=="")
    {
        error=true;
        
        document.getElementById("password").style.borderBottomColor="#DA6969";
    }
    if(new_password=="")
    {
        error=true;

        document.getElementById("new_password").style.borderBottomColor="#DA6969";
    }
    if(confirm_password=="")
    {
        error=true;
        
        document.getElementById("confirm_password").style.borderBottomColor="#DA6969";
    }

    if(!error)
    {
        if(new_password!=confirm_password)
        {
            document.getElementById("error-container").innerHTML='<i class="far fa-exclamation-triangle" style="margin-right:10px"></i>I valori non corrispondono';
            $("#error-container").show("fast","swing");

            document.getElementById("new_password").style.borderBottomColor="#DA6969";
            document.getElementById("confirm_password").style.borderBottomColor="#DA6969";
        }
        else
        {
            button.innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';

            $.post("changePassword.php",
            {
                username,
                password,
                new_password
            },
            function(response, status)
            {
                console.log(response)
                if(status=="success")
                {
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    {
                        button.innerHTML='Cambia password';
                        Swal.fire
                        ({
                            icon: 'error',
                            title: 'Errore',
                            text: "Se il problema persiste contatta l' amministratore"
                        });
                        console.log(response);
                    }
                    else
                    {
                        if(response.indexOf("ok")>-1)
                        {
                            button.innerHTML='<i class="far fa-check-circle" style="color:green"></i>';
                            window.location = 'login.html';
                            setTimeout(function(){ button.innerHTML='Cambia password'; }, 3000);
                        }
                        else
                        {
                            button.innerHTML='Cambia password';
                            document.getElementById("error-container").innerHTML='<i class="far fa-exclamation-triangle" style="margin-right:10px"></i>Username o password errati';
                            $("#error-container").show("fast","swing");
                        }
                    }
                }
                else
                {
                    button.innerHTML='Cambia password';
                    Swal.fire
                    ({
                        icon: 'error',
                        title: 'Errore',
                        text: "Se il problema persiste contatta l' amministratore"
                    });
                    console.log(status);
                }
            });
        }        
    }
    else
    {
        document.getElementById("error-container").innerHTML='<i class="far fa-exclamation-triangle" style="margin-right:10px"></i>Compila tutti i campi';
        $("#error-container").show("fast","swing");
    }
}
window.addEventListener("keydown", windowKeydown, false);
function windowKeydown(e)
{
    var keyCode = e.keyCode;
    switch(keyCode) 
    {
        case 13:e.preventDefault();document.getElementById("login-button").click();break;
    }
}
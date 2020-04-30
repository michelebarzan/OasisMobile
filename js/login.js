window.addEventListener("load", function(event)
{
    // iOS web app full screen hacks.
    if(window.navigator.standalone == true) {
            // make all link remain in web app mode.
            $('a').click(function() {
                    window.location = $(this).attr('href');
        return false;
            });
    }

    setTimeout(async function(){
        if(checkboxAutoLogin)
        {
            var username=await getCookie("username");
            var password=await getCookie("password");

            if(username!="" && password!="")
            {
                login(document.getElementById("login-button"),true);
            }
        }
        /*if(showPopupAggiungiAllaHome)
        {
            if (isIos())
            {
                if (!isInStandaloneMode())
                    getPopupAggiungiAllaHomeIos();
            }
        }*/
    }, 1500);
});
async function checkCoockies()
{
    var username=await getCookie("username");
    if(username!="")
    {
        document.getElementById("username").value=username;
    }
    var password=await getCookie("password");
    if(password!="")
    {
        document.getElementById("password").value=password;
    }
}
function login(button,autoLogin)
{
    var error=false;

    document.getElementById("username").style.borderBottomColor="gray";
    document.getElementById("password").style.borderBottomColor="gray";
    document.getElementById("error-container").innerHTML="";
    $("#error-container").hide("fast","swing");

    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    var ricorda=document.getElementById("ricorda").checked;

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

    if(!error)
    {
        if(autoLogin)
            button.innerHTML='Auto login<i class="fad fa-spinner-third fa-spin" style="margin-left:10px"></i>';
        else
            button.innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
        $.post("login.php",
        {
            username,
            password,
            ricorda
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    button.innerHTML='Login';
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
                        window.location = 'index.html';
                        setTimeout(function(){ button.innerHTML='Login'; }, 3000);
                    }
                    else
                    {
                        button.innerHTML='Login';
                        document.getElementById("error-container").innerHTML='<i class="far fa-exclamation-triangle" style="margin-right:10px"></i>Username o password errati';
                        $("#error-container").show("fast","swing");
                    }
                }
            }
            else
            {
                button.innerHTML='Login';
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
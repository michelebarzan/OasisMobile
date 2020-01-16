$(function()
{
    $(".structure-header").load("structure-header.html");
    $(".main-nav-bar").load("main-nav-bar.html"); 
});
window.addEventListener("load", async function(event)
{
    // iOS web app full screen hacks.
    if(window.navigator.standalone == true) {
            // make all link remain in web app mode.
            $('a').click(function() {
                    window.location = $(this).attr('href');
        return false;
            });
    }

    checkLogin();
});
async function checkLogin()
{
    var id_utente=await getSessionValue("id_utente");

    if(id_utente=="")
    {
        var username=await getCookie("username");
        var password=await getCookie("password");

        if(username=="" || password=="")
            logout();
        else
        {
            var ricorda=true;

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
                        logout();
                    }
                    else
                    {
                        if(response.indexOf("ko")>-1)
                        {
                            logout();
                        }
                    }
                }
                else
                {
                    logout();
                }
            });
        }
    }
}
function logout()
{
    $.get("logout.php",
    function(response, status)
    {
        window.location = 'login.html';
    });
}
function mainNavBarOpen()
{
    const speed=200;
    $('.main-nav-bar').show(speed);
    setTimeout(function()
    {
        $('.main-nav-bar-hidden-elements').css("visibility", "visible");
    }, speed);
    getPageList();
}
async function getPageList()
{
    document.getElementById("main-nav-bar-sections-outer-container").innerHTML="";
    var id_utente=await getSessionValue("id_utente");
    $.get("getPageList.php",
    {
        id_utente
    },
    function(response, status)
    {
        if(status=="success")
        {
            //console.log(response);
            var responseArray=[];
            var responseArrayObj = JSON.parse(response);
            for (var key in responseArrayObj)
            {
                responseArray.push(responseArrayObj[key]);							
            }
            
            var pagine_preferite=JSON.parse(responseArray[0]);
            var sezioni=JSON.parse(responseArray[1]);

            //console.log(sezioni);

            var mainNavBarSectionContainer=document.createElement("div");
            mainNavBarSectionContainer.setAttribute("class","main-nav-bar-section-container");

            var mainNavBarSectionTitle=document.createElement("div");
            mainNavBarSectionTitle.setAttribute("class","main-nav-bar-section-title");
            mainNavBarSectionTitle.innerHTML="Preferiti";

            mainNavBarSectionContainer.appendChild(mainNavBarSectionTitle);
            for(var i=0;i<pagine_preferite.length;i++)
            {
                var pagina=pagine_preferite[i];

                var mainNavBarSectionRow=document.createElement("div");
                mainNavBarSectionRow.setAttribute("class","main-nav-bar-section-row");

                var mainNavBarSectionRowLink=document.createElement("a");
                mainNavBarSectionRowLink.setAttribute("class","main-nav-bar-section-row-link");
                
                try 
                {
                    if (isIos())
                    {
                        if(isInStandaloneMode())
                            mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['pagina']+"')");
                        else
                            mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                    }
                    else
                        mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                } 
                catch (error) 
                {
                    mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['pagina']+"')");
                }

                //icona------------------------------------------------------------------------
                var mainNavBarSectionRowItem=document.createElement("div");
                mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
                mainNavBarSectionRowItem.setAttribute("style","width:30px;");

                var icona=document.createElement("i");
                icona.setAttribute("class",pagina['icona']);

                mainNavBarSectionRowItem.appendChild(icona);

                mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);

                //nome-------------------------------------------------------------------------
                var mainNavBarSectionRowItem=document.createElement("div");
                mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
                mainNavBarSectionRowItem.setAttribute("style","width:200px;padding-left:5px;");
                mainNavBarSectionRowItem.innerHTML=pagina['nomePagina'];

                mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);

                //stella------------------------------------------------------------------------
                var mainNavBarSectionRowItem=document.createElement("div");
                mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
                mainNavBarSectionRowItem.setAttribute("style","width:30px;text-align:right;");

                var stella=document.createElement("i");
                stella.setAttribute("class","fas fa-star");
                stella.setAttribute("style","color:#F2CE5A;cursor:pointer");
                stella.setAttribute("title","Rimuovi dai preferiti");
                stella.setAttribute("onclick","rimuoviPaginaPreferiti(event,"+pagina['id_pagina_preferita_utente']+")");

                mainNavBarSectionRowItem.appendChild(stella);

                mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);
                //-----------------------------------------------------------------------------

                mainNavBarSectionRow.appendChild(mainNavBarSectionRowLink);

                mainNavBarSectionContainer.appendChild(mainNavBarSectionRow);
            }
            document.getElementById("main-nav-bar-sections-outer-container").appendChild(mainNavBarSectionContainer);
            //console.log(sezioni);
            for(var i=0;i<sezioni.length;i++)
            {
                var sezione=sezioni[i];

                //console.log(sezione);

                var mainNavBarSectionContainer=document.createElement("div");
                mainNavBarSectionContainer.setAttribute("class","main-nav-bar-section-container");

                var mainNavBarSectionTitle=document.createElement("div");
                mainNavBarSectionTitle.setAttribute("class","main-nav-bar-section-title");
                mainNavBarSectionTitle.innerHTML=sezione["sezione"];

                mainNavBarSectionContainer.appendChild(mainNavBarSectionTitle);
                
                var pagine_sezioni=sezione['pagine'];
                for(var k=0;k<pagine_sezioni.length;k++)
                {
                    var pagina=pagine_sezioni[k];

                    var mainNavBarSectionRow=document.createElement("div");
                    mainNavBarSectionRow.setAttribute("class","main-nav-bar-section-row");

                    var mainNavBarSectionRowLink=document.createElement("a");
                    mainNavBarSectionRowLink.setAttribute("class","main-nav-bar-section-row-link");

                    try 
                    {
                        if (isIos())
                        {
                            if(isInStandaloneMode())
                                mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['pagina']+"')");
                            else
                                mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                        }
                        else
                            mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                    } 
                    catch (error) 
                    {
                        mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['pagina']+"')");
                    }

                    //icona------------------------------------------------------------------------
                    var mainNavBarSectionRowItem=document.createElement("div");
                    mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
                    mainNavBarSectionRowItem.setAttribute("style","width:30px;");

                    var icona=document.createElement("i");
                    icona.setAttribute("class",pagina['icona']);

                    mainNavBarSectionRowItem.appendChild(icona);

                    mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);

                    //nome-------------------------------------------------------------------------
                    var mainNavBarSectionRowItem=document.createElement("div");
                    mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
                    mainNavBarSectionRowItem.setAttribute("style","width:200px;padding-left:5px;");
                    mainNavBarSectionRowItem.innerHTML=pagina['nomePagina'];

                    mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);

                    //stella------------------------------------------------------------------------
                    var mainNavBarSectionRowItem=document.createElement("div");
                    mainNavBarSectionRowItem.setAttribute("class","main-nav-bar-section-row-item");
                    mainNavBarSectionRowItem.setAttribute("style","width:30px;text-align:right;");

                    var stella=document.createElement("i");
                    stella.setAttribute("class","fal fa-star");
                    stella.setAttribute("style","color:#F2CE5A;cursor:pointer");
                    stella.setAttribute("title","Aggiungi ai preferiti");
                    stella.setAttribute("onclick","aggiungiPaginaPreferiti(event,"+pagina['id_pagina']+")");

                    mainNavBarSectionRowItem.appendChild(stella);

                    mainNavBarSectionRowLink.appendChild(mainNavBarSectionRowItem);
                    //-----------------------------------------------------------------------------

                    mainNavBarSectionRow.appendChild(mainNavBarSectionRowLink);

                    mainNavBarSectionContainer.appendChild(mainNavBarSectionRow);
                }
                document.getElementById("main-nav-bar-sections-outer-container").appendChild(mainNavBarSectionContainer);
            }
        }
        else
            console.log(status);
    });
}
function mainNavBarClose()
{
    const speed=200;
    $('.main-nav-bar-hidden-elements').css("visibility", "hidden");
    $('.main-nav-bar').hide(speed);
}
async function aggiungiPaginaPreferiti(event,id_pagina)
{
    event.preventDefault();
    var id_utente=await getSessionValue("id_utente");
    $.post("aggiungiPaginaPreferiti.php",
    {
        id_pagina,
        id_utente
    },
    function(response, status)
    {
        if(status=="success")
        {
            getPageList();
            if(document.getElementsByClassName("homepageLinkContainer")[0]!=null)
                getPagineHomepage();
        }
        else
            console.log(status);
    });
}
function rimuoviPaginaPreferiti(event,id_pagina_preferita_utente)
{
    event.preventDefault();
    $.post("rimuoviPaginaPreferiti.php",
    {
        id_pagina_preferita_utente
    },
    function(response, status)
    {
        if(status=="success")
        {
            getPageList();
            if(document.getElementsByClassName("homepageLinkContainer")[0]!=null)
                getPagineHomepage();
        }
        else
            console.log(status);
    });
}
window.addEventListener("touchstart", function(event)
{
    try {
        if
        (
            event.target.className!="main-nav-bar" 
            && event.target.parentNode.className.indexOf("main-nav-bar")==-1
            && event.target.id!="main-nav-bar-open-button"
            && event.target.id!="main-nav-bar-open-button-icon"
            && event.target.id!="index-btn-aggiungi-preferiti"
        )
        {
            mainNavBarClose();
        }
    } catch (error) {
        mainNavBarClose();
    }
    
});
function getMainSettingsPopup()
{
    var table=document.createElement("table");
    table.setAttribute("class","material-design-table-dark");

    //tbody
    var tbody = table.createTBody();

    //Auto login
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var labelAutoLogin=document.createElement("label");
    labelAutoLogin.setAttribute("class","pure-material-checkbox");

    var inputAutoLogin=document.createElement("input");
    inputAutoLogin.setAttribute("type","checkbox");
    if(checkboxAutoLogin)
        inputAutoLogin.setAttribute("checked","checked");
    inputAutoLogin.setAttribute("id","checkboxAutoLogin");
    inputAutoLogin.setAttribute("onchange","checkboxAutoLogin=this.checked;setCookie('checkboxAutoLogin',this.checked)");
    labelAutoLogin.appendChild(inputAutoLogin);

    var spanAutoLogin=document.createElement("span");
    spanAutoLogin.setAttribute("style","color:white");
    spanAutoLogin.innerHTML="Auto login";
    labelAutoLogin.appendChild(spanAutoLogin);

    cell1.appendChild(labelAutoLogin);

    //Ripristina impostazioni predefinite
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var buttonRipristinaImpostazioniPredefinite=document.createElement("button");
    buttonRipristinaImpostazioniPredefinite.setAttribute("class","material-design-table-dark-button-reset-settings");
    buttonRipristinaImpostazioniPredefinite.setAttribute("onclick","restoreDefaultMainSettings()");
    buttonRipristinaImpostazioniPredefinite.innerHTML="Ripristina impostazioni predefinite";

    cell1.appendChild(buttonRipristinaImpostazioniPredefinite);

    //------------------------------------------------------------------------------------
    Swal.fire
    ({
        title: 'Impostazioni',
        background: '#363640',
        position:"top",
        width:"100%",
        html: table.outerHTML,
        showCloseButton: true,
        showConfirmButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                }
    }).then((result) => 
    {
        if (result.value)
        {
            
        }
    });
}
function restoreDefaultMainSettings()
{
    setCookie('checkboxAutoLogin',"");

    location.reload();
}
function gotopath(path)
{
    window.location = path;
}
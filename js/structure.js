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
        var id_utente=await getCookie("id_utente");

        if(username=="" || password=="" || id_utente=="")
        {
            logout();
        }
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
                        else
                        {
                            //window.alert(id_utente);
                            checkPermessoPagina(id_utente)
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
    else
        checkPermessoPagina(id_utente)
}
async function checkPermessoPagina(id_utente)
{
    $.get("checkPermessoPagina.php",
    {
        id_utente,
        nomePagina
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({type: 'error',title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                window.alert(response);
            }
            else
            {
                if(response.indexOf("false")>-1)
                {
                    var children = document.body.children;
                    for (var i = 0; i < children.length; i++)
                    {
                        var element=children[i];
                        element.style.display="none";
                    }

                    document.getElementsByClassName("structure-header")[0].style.display="";
                    document.getElementsByClassName("main-nav-bar")[0].style.display="";

                    var alert=document.createElement("div");
                    alert.setAttribute("id","alertAccessoNonConsentito");
                    alert.innerHTML='<i style="margin-right:5px" class="far fa-exclamation-triangle"></i>Accesso alla pagina non consentito';
                    document.body.appendChild(alert);
                }
                else
                {
                    if(nomePagina=="Home")
                        getPagineHomepage();
                }
            }
        }
    });
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
    setTimeout(async function()
    {
        var username=await getSessionValue("username");

        $( ".main-nav-bar-user-info-user-image img" ).attr('src','http://remote.oasisgroup.it/oasisusersimages/'+username+'.png');

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

                if(pagina['fileName']=="index")
                    mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                else
                    mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['fileName']+"');mainNavBarClose()");
                /*try 
                {
                    if (isIos())
                    {
                        if(isInStandaloneMode())
                            mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['fileName']+"')");
                        else
                            mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                    }
                    else
                        mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                } 
                catch (error) 
                {
                    mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['fileName']+"')");
                }*/

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

                    if(pagina['fileName']=="index")
                        mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                    else
                        mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['fileName']+"');mainNavBarClose()");
                    /*try 
                    {
                        if (isIos())
                        {
                            if(isInStandaloneMode())
                                mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['fileName']+"')");
                            else
                                mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                        }
                        else
                            mainNavBarSectionRowLink.setAttribute("href",pagina['pagina']);
                    } 
                    catch (error) 
                    {
                        mainNavBarSectionRowLink.setAttribute("onclick","gotopath('"+pagina['fileName']+"')");
                    }*/

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
    checkMainNavBarClose();
});
window.addEventListener("touchend", function(event)
{
    checkMainNavBarClose();
});
window.addEventListener("onclick", function(event)
{
    checkMainNavBarClose();
});
function checkMainNavBarClose()
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
}
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
                    document.getElementsByClassName("swal2-title")[0].style.color="gray";
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
function gotopath(fileName)
{
    unloadModules(pageInfo.fileName);
    document.getElementById("pageContainer").innerHTML="";
    pageInfo=null;
    loadModules(fileName);
}
function unloadModules(fileName)
{
    document.getElementById(fileName+".js").remove();
    document.getElementById(fileName+".css").remove();
}
function loadModules(fileName)
{
    var script=document.createElement("script");
    script.setAttribute("id",fileName+".js");
    script.setAttribute("src","js/"+fileName+".js");
    document.head.appendChild(script);
    
    var link=document.createElement("link");
    link.setAttribute("id",fileName+".css");
    link.setAttribute("rel","stylesheet");
    link.setAttribute("href","css/"+fileName+".css");
    document.head.appendChild(link);

    $.get(fileName+".html",
    function(response, status)
    {
        if(status=="success")
        {
            document.getElementById("pageContainer").innerHTML=response;
            setTimeout(function(){ modulesLoaded(fileName); }, 500);
        }
    });
}
function modulesLoaded(fileName)
{
    window["onload"+fileName]();
    document.title=pageInfo.nomePagina;
}
async function cambiaImmagineProfiloUtente(input)
{
    var immagine=input.files[0];
    if(immagine!=undefined && immagine!=null)
    {
        if(immagine.type.split("/").indexOf('image')>-1)
        {
            var username=await getSessionValue("username");
            var data= new FormData();
            data.append('immagine',immagine);
            data.append('username',username);
            $.ajax(
            {
                url:'uploadImmagineProfiloUtente.php',
                data:data,
                processData:false,
                contentType:false,
                type:'POST',
                success:function(response)
                    {
                        console.log(response);
                        if(response.indexOf("ok")>-1)
                        {
                            Swal.fire
                            ({
                                type:'success',
                                title: 'Immagine cambiata',
                                width:"100%",
                                showCloseButton: true,
                                showConfirmButton:false,
                                onOpen : function()
                                        {
                                            document.getElementsByClassName("swal2-title")[0].style.color="gray";
                                            document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                                        }
                            }).then((result) => 
                            {
                                mainNavBarOpen()
                            });
                        }
                        else
                        {
                            Swal.fire({type: 'error',title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        }
                    }
            });
        }
        else
            Swal.fire({type: 'error',title: 'Formato non valido',onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
    }
}
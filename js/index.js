var nomePagina="Home";

async function getPagineHomepage()
{
    $(".homepageLinkContainer").empty();
    var id_utente=await getSessionValue("id_utente");
    if(id_utente=="" || id_utente==null || id_utente==undefined)
    {
        document.getElementsByClassName("homepageLinkContainer")[0].innerHTML='<div class="fa-2x" style="width:100%;display:flex;justify-content:center"><i class="fad fa-spinner-third fa-spin"></i></div>';
        setTimeout(async function()
        {
            var id_utente=await getSessionValue("id_utente");
            if(id_utente=="" || id_utente==null || id_utente==undefined)
                var id_utente=await getCookie("id_utente");
            if(id_utente=="" || id_utente==null || id_utente==undefined)
                getPagineHomepage();
            else
            {
                logout();
            }
        }, 2500);
    }
    else
    {
        $.get("getPageList.php",
        {
            id_utente
        },
        function(response, status)
        {
            if(status=="success")
            {
                var responseArray=[];
                var responseArrayObj = JSON.parse(response);
                for (var key in responseArrayObj)
                {
                    responseArray.push(responseArrayObj[key]);							
                }
                
                var pagine_preferite=JSON.parse(responseArray[0]);
                var sezioni=JSON.parse(responseArray[1]);
                var homepageSectionContainerHeights=[];

                var container=document.getElementsByClassName("homepageLinkContainer")[0];

                var homepageSectionOuterContainer=document.createElement("div");
                homepageSectionOuterContainer.setAttribute("class","homepageSectionOuterContainer");

                var homepageSectionContainer=document.createElement("div");
                homepageSectionContainer.setAttribute("class","homepageSectionContainer");

                var homepageSectionTitle=document.createElement("div");
                homepageSectionTitle.setAttribute("class","homepageSectionTitle");
                homepageSectionTitle.innerHTML='Preferiti<i class="fad fa-info-circle" style="float:right;font-size:18px;margin-top:4px;" id="index-btn-aggiungi-preferiti" onclick="getInfoPupupAggiungiAiPreferiti()"></i>';
                homepageSectionOuterContainer.appendChild(homepageSectionTitle);

                for(var i=0;i<pagine_preferite.length;i++)
                {
                    var pagina=pagine_preferite[i];
                    
                    var homepageLink=document.createElement("div");
                    homepageLink.setAttribute("class","homepageLink");
                    homepageLink.setAttribute("onclick","gotopath('"+pagina['pagina']+"')");
                    homepageLink.setAttribute("onlongtouch","addPopupHomepageLink('"+pagina['pagina']+"',"+pagina['id_pagina_preferita_utente']+",true)");

                    var homepageLinkIconContainer=document.createElement("div");
                    homepageLinkIconContainer.setAttribute("class","homepageLinkiContainer")
                    
                    var homepageLinkIcon=document.createElement("i");
                    homepageLinkIcon.setAttribute("class",pagina['icona']);

                    var homepageLinkName=document.createElement("div");
                    homepageLinkName.setAttribute("class","homepageLinkTextContainer");
                    homepageLinkName.innerHTML=pagina["nomePagina"];

                    homepageLinkIconContainer.appendChild(homepageLinkIcon);
                    homepageLink.appendChild(homepageLinkIconContainer);
                    
                    homepageLink.appendChild(homepageLinkName);

                    homepageSectionContainer.appendChild(homepageLink);
                }

                homepageSectionOuterContainer.appendChild(homepageSectionContainer);
                container.appendChild(homepageSectionOuterContainer);

                homepageSectionContainerHeights.push(homepageSectionOuterContainer.offsetHeight);

                for(var i=0;i<sezioni.length;i++)
                {
                    var sezione=sezioni[i];

                    var homepageSectionOuterContainer=document.createElement("div");
                    homepageSectionOuterContainer.setAttribute("class","homepageSectionOuterContainer");

                    var homepageSectionContainer=document.createElement("div");
                    homepageSectionContainer.setAttribute("class","homepageSectionContainer");

                    var homepageSectionTitle=document.createElement("div");
                    homepageSectionTitle.setAttribute("class","homepageSectionTitle");
                    homepageSectionTitle.innerHTML=sezione["sezione"];

                    homepageSectionOuterContainer.appendChild(homepageSectionTitle);

                    var pagine_sezioni=sezione['pagine'];
                    for(var k=0;k<pagine_sezioni.length;k++)
                    {
                        var pagina=pagine_sezioni[k];

                        var homepageLink=document.createElement("div");
                        homepageLink.setAttribute("class","homepageLink");
                        homepageLink.setAttribute("onlongtouch","addPopupHomepageLink('"+pagina['pagina']+"',"+pagina['id_pagina']+",false)");
                        homepageLink.setAttribute("onclick","gotopath('"+pagina['pagina']+"')");

                        var homepageLinkIconContainer=document.createElement("div");
                        homepageLinkIconContainer.setAttribute("class","homepageLinkiContainer")
                        
                        var homepageLinkIcon=document.createElement("i");
                        homepageLinkIcon.setAttribute("class",pagina['icona']);

                        var homepageLinkName=document.createElement("div");
                        homepageLinkName.setAttribute("class","homepageLinkTextContainer");
                        homepageLinkName.innerHTML=pagina["nomePagina"];

                        homepageLinkIconContainer.appendChild(homepageLinkIcon);
                        homepageLink.appendChild(homepageLinkIconContainer);
                        
                        homepageLink.appendChild(homepageLinkName);

                        homepageSectionContainer.appendChild(homepageLink);
                    }

                    homepageSectionOuterContainer.appendChild(homepageSectionContainer);
                    container.appendChild(homepageSectionOuterContainer);

                    homepageSectionContainerHeights.push(homepageSectionOuterContainer.offsetHeight);
                }

                var maxHeight = Math.max.apply(null, homepageSectionContainerHeights);

                $(".homepageSectionOuterContainer").height(maxHeight);
            }
            else
                console.log(status);
        });
    }
}
function addPopupHomepageLink()
{
    /*console.log(onlongtouchElement);
    console.log(onlongtouchEvent);
    console.log(onlongtouchArguments);*/

    var wasOpen=$(".popup-homepage-link").length;

    var pagina=onlongtouchArguments[0];
    var preferita=onlongtouchArguments[2];
    if(preferita)
        var id_pagina_preferita_utente=onlongtouchArguments[1];
    else
        var id_pagina=onlongtouchArguments[1];

    removeAllPopupsHomepageLink();

    if(onlongtouchElement.nextSibling!=null)
    {
        var nextHomepageLink=onlongtouchElement.nextSibling;
        nextHomepageLink.style.marginLeft="50px";
    }

    var rect = onlongtouchElement.getBoundingClientRect();

    var popupHomepageLink=document.createElement("div");
    popupHomepageLink.setAttribute("class","popup-homepage-link");

    var popupHomepageLinkButton=document.createElement("button");
    popupHomepageLinkButton.setAttribute("class","popup-homepage-link-button");
    if(preferita)
    {
        popupHomepageLinkButton.innerHTML='<i class="fas fa-star popup-homepage-link-icon"></i>';
        popupHomepageLinkButton.setAttribute("onclick","removeAllPopupsHomepageLink();rimuoviPaginaPreferiti(event,"+id_pagina_preferita_utente+")");
    }
    else
    {
        popupHomepageLinkButton.innerHTML='<i class="fal fa-star popup-homepage-link-icon"></i>';
        popupHomepageLinkButton.setAttribute("onclick","removeAllPopupsHomepageLink();aggiungiPaginaPreferiti(event,"+id_pagina+")");
    }
    popupHomepageLink.appendChild(popupHomepageLinkButton);

    var popupHomepageLinkButton=document.createElement("button");
    popupHomepageLinkButton.setAttribute("class","popup-homepage-link-button");
    popupHomepageLinkButton.innerHTML='<i class="fad fa-external-link popup-homepage-link-icon"></i>';
    popupHomepageLinkButton.setAttribute("style","margin-top:10px");
    popupHomepageLinkButton.setAttribute("onclick","gotopath('"+pagina+"')");
    popupHomepageLink.appendChild(popupHomepageLinkButton);

    var left=rect.left+onlongtouchElement.offsetWidth;
    var top=rect.top;

    //Non so perche ma funziona, almeno... con solo due elementi sembra funzionare
    if(onlongtouchElement.parentElement.childElementCount>1)
    {
        if(wasOpen && onlongtouchElement.nextSibling==null)
            left=left-40;
    }

    document.body.appendChild(popupHomepageLink);

    $(popupHomepageLink).css({"left":left+"px","top":top+"px"});
    $(popupHomepageLink).show("fast","swing");
    $(popupHomepageLink).css({"display":"flex"});
}
function removeAllPopupsHomepageLink()
{
    $(".popup-homepage-link").remove();
    $(".homepageLink").css("margin-left","10px");
}
window.addEventListener("touchstart", function(event)
{
    checkRemoveAllPopupsHomepageLink();
});
/*window.addEventListener("touchend", function(event)
{
    checkRemoveAllPopupsHomepageLink();
});*/
window.addEventListener("onclick", function(event)
{
    checkRemoveAllPopupsHomepageLink();
});
function checkRemoveAllPopupsHomepageLink()
{
    try {
        if
        (
            event.target.className!="popup-homepage-link" 
            && event.target.className!="popup-homepage-link-button"
            && event.target.className!="fal fa-star popup-homepage-link-icon"
            && event.target.className!="fas fa-star popup-homepage-link-icon"
            && event.target.className!="fad fa-external-link popup-homepage-link-icon"
        )
        {
            removeAllPopupsHomepageLink();
        }
    } catch (error) {
        removeAllPopupsHomepageLink();
    }
}
function getInfoPupupAggiungiAiPreferiti()
{
    window.alert("Per aggiugere o rimuovere una pagina dai preferiti, premi sopra di essa");
}
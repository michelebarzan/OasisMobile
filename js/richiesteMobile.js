var nomePagina="Richieste";
var pageInfo=
{
    pagina:"richiesteMobile.html",
    nomePagina:"Richieste",
    id_pagina:"1033",
    fileName:"richiesteMobile"
};

var rcDeafaultTop=0;
var tcbExpanded=false;
var view;

var id_richieste=[];
var infoRichieste=[];
//var elementsRichieste=[];NON IN USO PERCHE IN APPENDNUOVAREPLICA NON RIESCO AD ELIMINARE L'ELEMENTO DA LUI
var filesRisposta=[];

/*window.addEventListener("load", async function(event)
{
    
});*/
async function onloadrichiesteMobile()
{
    //Controlla le impostazioni salvate nei cookie e sul server
    var checkCookieSettingsResponse=await checkCookieSettings();
    if(checkCookieSettingsResponse)
    {
        //Controlla cosa mostrare all' inizio
        if(checkboxOnloadTutteLeRichieste)
            document.getElementById('btnTutteLeRichieste').click();
        if(checkboxOnloadGestioneRichieste)
            document.getElementById('btnGestioneRichieste').click();
    }
    checkServerSideSettings();

    //Posiziona correttamente il container per le richieste, in base alla configurazione dei controlli
    var tcbHeight=$(".top-control-bar").height();
    rcDeafaultTop=50+10+tcbHeight;
    setRcTop(rcDeafaultTop);

    //Aggiunge il bottone go to top
    addTopButton();
}
function setRcTop(rcHeight)
{
    $(".richieste-container").css({"top":rcHeight+"px"});
}
function resetStyle(button)
{
    $(".top-control-bar-button").css("color","");
    button.style.color="#4C91CB";
}
function toggleTopControlBar(button)
{
    if(!tcbExpanded)
    {
        $(".top-control-bar").css("flex-direction","column");
        button.innerHTML='<i class="fad fa-caret-circle-up fa-2x" ></i>';
        $(".top-control-bar-hidden-button").show();
        $(".top-control-bar-hidden-button").css("display","flex");
        button.style.justifyContent="left";
    }
    else
    {
        $(".top-control-bar-hidden-button").hide();
        $(".top-control-bar").css("flex-direction","row");
        button.innerHTML='<i class="fad fa-caret-circle-down fa-2x" ></i>';
        button.style.justifyContent="center";
    }

    var tcbHeight=$(".top-control-bar").height();
    rcHeight=50+10+tcbHeight;
    
    setRcTop(rcHeight);

    tcbExpanded=!tcbExpanded;
}
function reQueryView()
{
    switch(view)
    {
        case "tutte_le_richieste":getTutteRichieste();break;
        case "gestione_richieste":getGestioneRichieste();break;
    }
}
function emptyRichieste()
{
    id_richieste=[];
    infoRichieste=[];
    //elementsRichieste=[];

    document.getElementById("richieste-container").innerHTML="";
}
async function getGestioneRichieste()
{
    $(".top-control-bar-button").prop("disabled",true);

    view="gestione_richieste";

    emptyRichieste();

    var container=document.getElementById("richieste-container");

    var spinnerContainer=document.createElement("div");
    spinnerContainer.setAttribute("class","fa-2x");
    spinnerContainer.setAttribute("style","text-align:center");
    spinnerContainer.setAttribute("id","spinner-richieste");
    var spinner=document.createElement("i");
    spinner.setAttribute("class","fad fa-spinner-third fa-spin");
    spinnerContainer.appendChild(spinner);
    container.appendChild(spinnerContainer);

    if(filterStato.length==0)
        filterStato=["In attesa di chiusura","Aperta","Presa in carico"];
    if(filterMacrocategoria.length==0)
        filterMacrocategoria=await getIdMacrocategorie();
    /*if(filterUtente.length==0)
        filterUtente=await getIdUtenti();

    id_richieste=await getIdRichiesteGestione(filterStato,filterMacrocategoria,filterUtente);
    id_richieste.reverse();*/

    id_richieste=await getIdRichiesteGestione(filterStato,filterMacrocategoria);
    id_richieste.reverse();
    
    //console.log(id_richieste);

    if(id_richieste.length==0)
    {
        container.innerHTML="<div class='richieste-error-message-container'>Nessuna richiesta trovata con i filtri selezionati</div>"
    }
    for (var i = 0; i < id_richieste.length; i++)
    {
        var id_richiesta=id_richieste[i];

        var infoRichiesta=await getInfoRichiesta(id_richiesta);
        //console.log(infoRichiesta);
        var elementRichiesta=getElementRichiesta(infoRichiesta);
        //console.log(elementRichiesta);

        infoRichieste.push(infoRichiesta);
        //elementsRichieste.push(elementRichiesta);

        //container.appendChild(elementRichiesta);
        container.insertBefore(elementRichiesta, container.lastChild);
    }
    try {
        document.getElementById("spinner-richieste").remove();
    } catch (error) {}

    $(".top-control-bar-button").prop("disabled",false);
    
    //console.log(infoRichieste);
}
async function getTutteRichieste()
{
    $(".top-control-bar-button").prop("disabled",true);
    
    view="tutte_le_richieste";

    emptyRichieste();

    var container=document.getElementById("richieste-container");

    var spinnerContainer=document.createElement("div");
    spinnerContainer.setAttribute("class","fa-2x");
    spinnerContainer.setAttribute("style","text-align:center");
    spinnerContainer.setAttribute("id","spinner-richieste");
    var spinner=document.createElement("i");
    spinner.setAttribute("class","fad fa-spinner-third fa-spin");
    spinnerContainer.appendChild(spinner);
    container.appendChild(spinnerContainer);

    if(filterStato.length==0)
        filterStato=["In attesa di chiusura","Aperta","Presa in carico"];
    if(filterMacrocategoria.length==0)
        filterMacrocategoria=await getIdMacrocategorie();
    if(filterUtente.length==0)
        filterUtente=await getIdUtenti();

    id_richieste=await getIdRichieste(filterStato,filterMacrocategoria,filterUtente);
    id_richieste.reverse();
    
    //console.log(id_richieste);

    if(id_richieste.length==0)
    {
        container.innerHTML="<div class='richieste-error-message-container'>Nessuna richiesta trovata con i filtri selezionati</div>"
    }
    for (var i = 0; i < id_richieste.length; i++)
    {
        var id_richiesta=id_richieste[i];

        var infoRichiesta=await getInfoRichiesta(id_richiesta);
        //console.log(infoRichiesta);
        var elementRichiesta=getElementRichiesta(infoRichiesta);
        //console.log(elementRichiesta);

        infoRichieste.push(infoRichiesta);
        //elementsRichieste.push(elementRichiesta);

        //container.appendChild(elementRichiesta);
        container.insertBefore(elementRichiesta, container.lastChild);
    }
    try {
        document.getElementById("spinner-richieste").remove();
    } catch (error) {}

    $(".top-control-bar-button").prop("disabled",false);
    
    //console.log(infoRichieste);
}
function getIdMacrocategorie()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getIdMacrocategorie.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function getIdUtenti()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getIdUtenti.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function getIdRichieste(filterStato,filterMacrocategoria,filterUtente)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONstati=JSON.stringify(filterStato)
        var JSONmacrocategorie=JSON.stringify(filterMacrocategoria)
        var JSONutenti=JSON.stringify(filterUtente)
        $.get("getIdRichieste.php",
        {
            JSONstati,
            JSONmacrocategorie,
            JSONutenti
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
/*function getIdRichiesteGestione(filterStato,filterMacrocategoria,filterUtente)
{
    return new Promise(async function (resolve, reject) 
    {
        var id_utente=await getSessionValue("id_utente");
        var JSONstati=JSON.stringify(filterStato)
        var JSONmacrocategorie=JSON.stringify(filterMacrocategoria)
        var JSONutenti=JSON.stringify(filterUtente)
        $.get("getIdRichiesteGestione.php",
        {
            JSONstati,
            JSONmacrocategorie,
            JSONutenti,
            id_utente
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}*/
function getIdRichiesteGestione(filterStato,filterMacrocategoria)
{
    return new Promise(async function (resolve, reject) 
    {
        var id_utente=await getSessionValue("id_utente");
        var JSONstati=JSON.stringify(filterStato)
        var JSONmacrocategorie=JSON.stringify(filterMacrocategoria)
        $.get("getIdRichiesteGestione.php",
        {
            JSONstati,
            JSONmacrocategorie,
            id_utente
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function getInfoRichiesta(id_richiesta)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getInfoRichiesta.php",
        {
            id_richiesta
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function getElementRichiesta(infoRichiesta)
{
    var richiestaOuterContainer=document.createElement("div");
    richiestaOuterContainer.setAttribute("class","richiesta-outer-container");
    if((infoRichiesta["urgente"])=="true")
        richiestaOuterContainer.setAttribute("style","border:3px solid red;animation: flashingBorder 1s linear infinite;border-radius:4px;");
    richiestaOuterContainer.setAttribute("id","richiestaElement"+infoRichiesta['id_richiesta']);
    richiestaOuterContainer.setAttribute("id_richiesta",infoRichiesta['id_richiesta']);
    richiestaOuterContainer.setAttribute("onclick","expandRichiesta("+infoRichiesta['id_richiesta']+",'dettagli',true)");

    var richiestaInnerContainer=document.createElement("div");
    richiestaInnerContainer.setAttribute("class","richiesta-inner-container");
    richiestaInnerContainer.setAttribute("stato",infoRichiesta['stato']);

    if(checkboxMostraIdentificativoRichiesta)
    {
        var richiestaIdContainer=document.createElement("div");
        richiestaIdContainer.setAttribute("class","richiesta-id-container");
        richiestaIdContainer.setAttribute("stato",infoRichiesta['stato']);
        richiestaIdContainer.innerHTML="#"+infoRichiesta['id_richiesta'];
        richiestaOuterContainer.appendChild(richiestaIdContainer);
    }
    else
    {
        richiestaInnerContainer.setAttribute("style","border-top-left-radius: 4px;");
    }

    var userImage=document.createElement("img");
    userImage.setAttribute("class","user-image");
    userImage.setAttribute("onerror","javascript:this.src='images/user.png'");
    userImage.setAttribute("src","http://remote.oasisgroup.it/oasisusersimages/"+infoRichiesta['username_utente_creazione']+".png");
    richiestaInnerContainer.appendChild(userImage);

    var basicInfoContainer=document.createElement("div");
    basicInfoContainer.setAttribute("class","basic-info-container");

    var basicInfoContainerRow=document.createElement("div");
    basicInfoContainerRow.setAttribute("class","basic-info-container-row");
    basicInfoContainerRow.setAttribute("style","height:15px");

    var usernameContainer=document.createElement("div");
    usernameContainer.setAttribute("class","simple-text-container");
    usernameContainer.setAttribute("style","font-weight: bold;white-space: nowrap; text-overflow: ellipsis;");
    usernameContainer.innerHTML=infoRichiesta['username_utente_creazione'];
    basicInfoContainerRow.appendChild(usernameContainer);

    var dataContainer=document.createElement("div");
    dataContainer.setAttribute("class","simple-text-container");
    dataContainer.setAttribute("style","color:#ddd;text-align:right;white-space: nowrap; text-overflow: ellipsis;");
    var data_creazione=getDatetimeString(infoRichiesta["data_creazione"]);
    dataContainer.innerHTML=data_creazione;
    basicInfoContainerRow.appendChild(dataContainer);

    basicInfoContainer.appendChild(basicInfoContainerRow);

    var basicInfoContainerRow=document.createElement("div");
    basicInfoContainerRow.setAttribute("class","basic-info-container-row");
    basicInfoContainerRow.setAttribute("style","margin-top:5px;height:30px");

    var oggettoContainer=document.createElement("div");
    oggettoContainer.setAttribute("class","simple-text-container");
    oggettoContainer.innerHTML=infoRichiesta['oggetto'];
    basicInfoContainerRow.appendChild(oggettoContainer);

    basicInfoContainer.appendChild(basicInfoContainerRow);

    richiestaInnerContainer.appendChild(basicInfoContainer);

    richiestaOuterContainer.appendChild(richiestaInnerContainer);

    return richiestaOuterContainer;
}
async function expandRichiesta(id_richiesta,display,animationSwal)
{
    filesRisposta=[];

    var infoRichiesta=getFirstObjByPropValue(infoRichieste,"id_richiesta",id_richiesta);
    switch(infoRichiesta["stato"])
    {
        case "Aperta":colorStato="#DA6969";iconStato="far fa-exclamation-circle";break;
        case "Presa in carico":colorStato="#4C91CB";iconStato="far fa-cogs";break;
        case "In attesa di chiusura":colorStato="#E9A93A";iconStato="far fa-hourglass-half";break;
        case "Chiusa":colorStato="#70B085";iconStato="far fa-check-circle";break;
    }
    
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-dettagli-richiesta-outer-container");

    var rowContainer=document.createElement("div");
    rowContainer.setAttribute("class","row-container");
    rowContainer.setAttribute("style","border-top-right-radius: 4px;;border-top-left-radius: 4px;");
    rowContainer.setAttribute("stato",infoRichiesta["stato"]);

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    if((infoRichiesta["urgente"])=="true")
        simpleTextContainer.setAttribute("style","color:red;animation: flashingFont 1s linear infinite;font-weight:bold;width:50%;height:30px;line-height:30px");
    else
        simpleTextContainer.setAttribute("style","font-weight:bold;width:50%;height:30px;line-height:30px");
    simpleTextContainer.innerHTML='#'+infoRichiesta["id_richiesta"];
    rowContainer.appendChild(simpleTextContainer);

    var closeButtonContainer=document.createElement("div");
    closeButtonContainer.setAttribute("id","popupDettagliRichiestaCloseButtonContainer");
    closeButtonContainer.setAttribute("style","width:50%;display:flex;justify-content: flex-end;height:30px;align-items: center;");
    rowContainer.appendChild(closeButtonContainer);

    outerContainer.appendChild(rowContainer);

    var rowContainer=document.createElement("div");
    rowContainer.setAttribute("class","row-container");
    rowContainer.setAttribute("stato",infoRichiesta["stato"]);

    var userImage=document.createElement("img");
    userImage.setAttribute("class","user-image");
    userImage.setAttribute("onerror","javascript:this.src='images/user.png'");
    userImage.setAttribute("src","http://remote.oasisgroup.it/oasisusersimages/"+infoRichiesta['username_utente_creazione']+".png");
    rowContainer.appendChild(userImage);

    var rowItem=document.createElement("div");
    rowItem.setAttribute("style","margin-left:10px");

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","font-weight:bold;height:25px;line-height:25px;text-overflow: ellipsis;");
    simpleTextContainer.innerHTML=infoRichiesta["username_utente_creazione"];
    rowItem.appendChild(simpleTextContainer);

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","color:#ddd;font-weight:bold;height:25px;line-height:25px;text-overflow: ellipsis;");
    var data_creazione=getDatetimeString(infoRichiesta["data_creazione"]);
    simpleTextContainer.innerHTML=data_creazione;
    rowItem.appendChild(simpleTextContainer);

    rowContainer.appendChild(rowItem);

    outerContainer.appendChild(rowContainer);

    var rowContainer=document.createElement("div");
    rowContainer.setAttribute("class","row-container");
    rowContainer.setAttribute("style","flex-direction: column;padding-bottom:10px");
    rowContainer.setAttribute("stato",infoRichiesta["stato"]);
    
    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","font-weight:bold;text-decoration:underline;margin-bottom:5px");
    simpleTextContainer.innerHTML="Oggetto";
    rowContainer.appendChild(simpleTextContainer);

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","text-overflow: ellipsis;");
    simpleTextContainer.innerHTML=infoRichiesta["oggetto"];
    rowContainer.appendChild(simpleTextContainer);

    outerContainer.appendChild(rowContainer);

    var containerBottoniDettagliRisposte=document.createElement("div");
    containerBottoniDettagliRisposte.setAttribute("class","container-bottoni-dettagli-risposte");

    var btnDettagli=document.createElement("button");
    btnDettagli.setAttribute("id","popupDettagliRichiestaBtnDettagli");
    btnDettagli.setAttribute("onclick","getDettagliRichiestaPopupDettagli('si',this,'"+colorStato+"')");
    btnDettagli.setAttribute("style","background-color:"+colorStato+";text-decoration:underline");
    btnDettagli.innerHTML='DETTAGLI<i style="margin-left:5px" class="far fa-info-circle"></i>';
    containerBottoniDettagliRisposte.appendChild(btnDettagli);

    var btnRisposte=document.createElement("button");
    btnRisposte.setAttribute("id","popupDettagliRichiestaBtnRisposte");
    btnRisposte.setAttribute("onclick","getRisposteRichiestaPopupDettagli('si',this,'"+colorStato+"')");
    btnRisposte.setAttribute("style","background-color:white");
    btnRisposte.innerHTML='RISPOSTE<i style="margin-left:5px" class="fad fa-reply-all"></i>';
    containerBottoniDettagliRisposte.appendChild(btnRisposte);

    outerContainer.appendChild(containerBottoniDettagliRisposte);

    var rowContainer=document.createElement("div");
    rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-dettagli");
    rowContainer.setAttribute("style","flex-direction: column;");
    rowContainer.setAttribute("id","popupDettagliRichiestaStatoContainer");

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","font-weight:bold;text-decoration:underline;margin-bottom:5px;");
    simpleTextContainer.innerHTML="Stato";
    rowContainer.appendChild(simpleTextContainer);

    var rowItem=document.createElement("div");
    rowItem.setAttribute("style","");

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","font-weight:bold;text-overflow: ellipsis;color:"+colorStato);
    simpleTextContainer.setAttribute("id","popupDettagliRichiestaStato");
    simpleTextContainer.innerHTML=infoRichiesta["stato"]+'<i class="'+iconStato+'" style="margin-left:5px"></i>';
    rowItem.appendChild(simpleTextContainer);

    rowContainer.appendChild(rowItem);

    var id_utente=await getSessionValue("id_utente");

    if(view=="tutte_le_richieste" && parseInt(id_utente)==parseInt(infoRichiesta["utente_creazione"]))
    {
        if(infoRichiesta["stato"]=="In attesa di chiusura")
        {
            var rowItem=document.createElement("div");
            rowItem.setAttribute("style","display:flex;flex-direction:row");

            var buttonCambiaStatoRichiesta=document.createElement("button");
            buttonCambiaStatoRichiesta.setAttribute("class","button-cambia-stato-richiesta");
            buttonCambiaStatoRichiesta.setAttribute("onclick","cambiaStatoRichiesta('Chiusa',this,"+infoRichiesta['id_richiesta']+")");
            buttonCambiaStatoRichiesta.setAttribute("style","color:white;background-color:#70B085");
            buttonCambiaStatoRichiesta.innerHTML='Chiudi richiesta<i class="far fa-check-circle" style="margin-left:10px"></i>';
            rowItem.appendChild(buttonCambiaStatoRichiesta);

            var buttonCambiaStatoRichiesta=document.createElement("button");
            buttonCambiaStatoRichiesta.setAttribute("class","button-cambia-stato-richiesta");
            buttonCambiaStatoRichiesta.setAttribute("style","color:white;background-color:#DA6969");
            buttonCambiaStatoRichiesta.setAttribute("onclick","cambiaStatoRichiesta('Aperta',this,"+infoRichiesta['id_richiesta']+")");
            buttonCambiaStatoRichiesta.innerHTML='Riapri richiesta<i class="far fa-exclamation-circle" style="margin-left:10px"></i>';
            rowItem.appendChild(buttonCambiaStatoRichiesta);

            rowContainer.appendChild(rowItem);
        }
    }
    if(view=="gestione_richieste")
    {
        if(infoRichiesta["stato"]=="Aperta")
        {
            var rowItem=document.createElement("div");
            rowItem.setAttribute("style","display:flex;flex-direction:row");

            var buttonCambiaStatoRichiesta=document.createElement("button");
            buttonCambiaStatoRichiesta.setAttribute("class","button-cambia-stato-richiesta");
            buttonCambiaStatoRichiesta.setAttribute("onclick","cambiaStatoRichiesta('Presa in carico',this,"+infoRichiesta['id_richiesta']+")");
            buttonCambiaStatoRichiesta.setAttribute("style","color:white;background-color:#4C91CB");
            buttonCambiaStatoRichiesta.innerHTML='Prendi in carico<i class="far fa-cogs" style="margin-left:10px"></i>';
            rowItem.appendChild(buttonCambiaStatoRichiesta);

            rowContainer.appendChild(rowItem);
        }
        if(infoRichiesta["stato"]=="Presa in carico")
        {
            var rowItem=document.createElement("div");
            rowItem.setAttribute("style","display:flex;flex-direction:row");

            var buttonCambiaStatoRichiesta=document.createElement("button");
            buttonCambiaStatoRichiesta.setAttribute("class","button-cambia-stato-richiesta");
            buttonCambiaStatoRichiesta.setAttribute("onclick","cambiaStatoRichiesta('In attesa di chiusura',this,"+infoRichiesta['id_richiesta']+")");
            buttonCambiaStatoRichiesta.setAttribute("style","color:white;background-color:#E9A93A");
            buttonCambiaStatoRichiesta.innerHTML='Proponi chiusura<i class="far fa-hourglass-half" style="margin-left:10px"></i>';
            rowItem.appendChild(buttonCambiaStatoRichiesta);

            rowContainer.appendChild(rowItem);

        }
    }

    rowContainer.appendChild(rowItem);

    outerContainer.appendChild(rowContainer);

    var standardColumns=
    [
        {
            label:"Descrizione",
            name:"descrizione"
        },
        {
            label:"Note",
            name:"note"
        },
        {
            label:"Area di competenza",
            name:"nome_macrocategoria"
        },
        {
            label:"Categoria",
            name:"nome_categoria"
        }
    ];

    standardColumns.forEach(function(column)
    {
        if(infoRichiesta[column["name"]]=='' || infoRichiesta[column["name"]]==null || infoRichiesta[column["name"]]=='NULL' || infoRichiesta[column["name"]].length==0)
        {
            //console.log("Colonna "+column['name']+" vuota");
        }
        else
        {
            var rowContainer=document.createElement("div");
            rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-dettagli");
            rowContainer.setAttribute("style","flex-direction: column;");
            
            var simpleTextContainer=document.createElement("div");
            simpleTextContainer.setAttribute("class","simple-text-container");
            simpleTextContainer.setAttribute("style","font-weight:bold;text-decoration:underline;margin-bottom:5px");
            simpleTextContainer.innerHTML=column["label"];
            rowContainer.appendChild(simpleTextContainer);

            var simpleTextContainer=document.createElement("div");
            simpleTextContainer.setAttribute("class","simple-text-container");
            simpleTextContainer.setAttribute("style","text-overflow: ellipsis;");
            simpleTextContainer.innerHTML=infoRichiesta[column["name"]];
            rowContainer.appendChild(simpleTextContainer);

            outerContainer.appendChild(rowContainer);
        }
    });

    var extraColumns=await getExtraColumns(infoRichiesta["id_macrocategoria"]);

    extraColumns.forEach(function(column)
    {
        if(infoRichiesta[column["name"]]=='' || infoRichiesta[column["name"]]==null || infoRichiesta[column["name"]]=='NULL' || infoRichiesta[column["name"]].length==0)
        {
            //console.log("Colonna "+column['name']+" vuota");
        }
        else
        {
            var rowContainer=document.createElement("div");
            rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-dettagli");
            rowContainer.setAttribute("style","flex-direction: column;");
            
            var simpleTextContainer=document.createElement("div");
            simpleTextContainer.setAttribute("class","simple-text-container");
            simpleTextContainer.setAttribute("style","font-weight:bold;text-decoration:underline;margin-bottom:5px");
            simpleTextContainer.innerHTML=column["label"];
            rowContainer.appendChild(simpleTextContainer);

            var simpleTextContainer=document.createElement("div");
            simpleTextContainer.setAttribute("class","simple-text-container");
            simpleTextContainer.setAttribute("style","text-overflow: ellipsis;");
            simpleTextContainer.innerHTML=infoRichiesta[column["name"]];
            rowContainer.appendChild(simpleTextContainer);

            outerContainer.appendChild(rowContainer);
        }
    });

    var rowContainer=document.createElement("div");
    rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-dettagli");
    rowContainer.setAttribute("style","flex-direction: column");
    
    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","margin-bottom:5px;font-weight:bold;text-decoration:underline;overflow:visible");
    simpleTextContainer.innerHTML="Utenti coinvolti";
    rowContainer.appendChild(simpleTextContainer);

    if(view=="gestione_richieste")
    {
        var selectAggiungiUtentiCoinvolti=document.createElement("select");
        selectAggiungiUtentiCoinvolti.setAttribute("id","popupDettagliRichiestaSelectAggiungiUtentiCoinvolti");
        selectAggiungiUtentiCoinvolti.setAttribute("multiple","multiple");

        var utenti=await getUtenti();

        var utenti_coinvolti=infoRichiesta["utenti_coinvolti"];
        var id_utenti_coinvolti=[];
        utenti_coinvolti.forEach(function(utente)
        {
            id_utenti_coinvolti.push(utente.id_utente);
        });
        var id_utenti_disabilitati=[];
        utenti_coinvolti.forEach(function(utente)
        {
            if(utente.disabilitato=="true")
                id_utenti_disabilitati.push(utente.id_utente);
        });

        utenti.forEach(function(utente)
        {
            var option=document.createElement("option");
            option.setAttribute("value",utente.value);
            if(id_utenti_coinvolti.includes(parseInt(utente.value)))
                option.setAttribute("selected","selected");
            if(id_utenti_disabilitati.includes(parseInt(utente.value)))
                option.setAttribute("disabled","disabled");
            option.innerHTML=utente.label;

            selectAggiungiUtentiCoinvolti.appendChild(option);
        });

        rowContainer.appendChild(selectAggiungiUtentiCoinvolti);
    }
    if(view=="tutte_le_richieste")
    {
        var listUtentiCoinvolti=document.createElement("ul");
        listUtentiCoinvolti.setAttribute("class","simple-list");

        var utenti_coinvolti=infoRichiesta["utenti_coinvolti"];
        utenti_coinvolti.forEach(function(utente)
        {
            var listUtentiCoinvoltiItem=document.createElement("li");
            listUtentiCoinvoltiItem.innerHTML=utente.username;
            listUtentiCoinvolti.appendChild(listUtentiCoinvoltiItem);
        });

        rowContainer.appendChild(listUtentiCoinvolti);
    }

    outerContainer.appendChild(rowContainer);

    var allegati_richieste=infoRichiesta["allegati"];

    if(allegati_richieste.length>0)
    {
        var rowContainer=document.createElement("div");
        rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-dettagli");
        rowContainer.setAttribute("style","flex-direction: column");
        
        var simpleTextContainer=document.createElement("div");
        simpleTextContainer.setAttribute("class","simple-text-container");
        simpleTextContainer.setAttribute("style","font-weight:bold;text-decoration:underline;margin-bottom:5px");
        simpleTextContainer.innerHTML="Allegati";
        rowContainer.appendChild(simpleTextContainer);

        var allegatiRichiesteContainer=document.createElement("div");
        allegatiRichiesteContainer.setAttribute("class","file-container");

        allegati_richieste.forEach(function(allegato)
        {
            var percorso=allegato.percorso;
            var nomeFile= percorso.split("\\");
            var nomeFile = nomeFile[nomeFile.length - 1];
            var formato= nomeFile.split(".")[1];

            var allegatiRichiesteItem=document.createElement("div");
            allegatiRichiesteItem.setAttribute('onclick',"downloadAllegato('"+nomeFile+"')");
            allegatiRichiesteItem.setAttribute("class","file-container-item");
            allegatiRichiesteItem.innerHTML='<i class="fad fa-download"></i><span>'+nomeFile+'</span>';
            allegatiRichiesteContainer.appendChild(allegatiRichiesteItem);
        });
        rowContainer.appendChild(allegatiRichiesteContainer);

        outerContainer.appendChild(rowContainer);
    }

    var risposte=infoRichiesta["risposte"];
    if(risposte.length==0)
    {
        var rowContainer=document.createElement("div");
        rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-risposte");
        rowContainer.setAttribute("style","flex-direction: column");
        
        var simpleTextContainer=document.createElement("div");
        simpleTextContainer.setAttribute("class","simple-text-container");
        simpleTextContainer.setAttribute("style","font-weight:bold;text-decoration:underline;margin-bottom:5px");
        simpleTextContainer.innerHTML="Ancora nessuna risposta";
        rowContainer.appendChild(simpleTextContainer);

        outerContainer.appendChild(rowContainer);
    }
    else
    {
        var c=0;
        risposte.forEach(function(risposta)
        {
            var rowContainerBackground="white";
            if(isOdd(c))
            {
                switch(infoRichiesta["stato"])
                {
                    case "Aperta":var rowContainerBackground="rgba(218, 105, 105, 0.35)";;break;
                    case "Presa in carico":var rowContainerBackground="rgba(76, 145, 203, 0.35)";;break;
                    case "In attesa di chiusura":var rowContainerBackground="rgba(233, 169, 58, 0.35)";;break;
                    case "Chiusa":var rowContainerBackground="rgba(112, 176, 133, 0.35)";;break;
                }
            }

            var rowContainerPaddingTop="5px;";
            if(c==0)
                var rowContainerPaddingTop="0px";
            
            var rowContainerMarginTop="0px;";
            if(c==0)
                var rowContainerMarginTop="10px";
            
            var rowContainer=document.createElement("div");
            rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-risposte");
            rowContainer.setAttribute("style","margin-top:"+rowContainerMarginTop+";padding-top:"+rowContainerPaddingTop+";padding-bottom:5px;flex-direction: column;background-color:"+rowContainerBackground);
            
            var rowItem=document.createElement("div");
            rowItem.setAttribute("style","display:flex;flex-direction:row;margin-bottom:5px");

            var simpleTextContainer=document.createElement("div");
            simpleTextContainer.setAttribute("class","simple-text-container");
            simpleTextContainer.setAttribute("style","font-weight:bold;width:50%;text-align:left");
            simpleTextContainer.innerHTML=risposta["username_utente_risposta"];
            rowItem.appendChild(simpleTextContainer);

            var simpleTextContainer=document.createElement("div");
            simpleTextContainer.setAttribute("class","simple-text-container");
            simpleTextContainer.setAttribute("style","color:gray;width:50%;text-align:right");
            var data_risposta=getDatetimeString(risposta["data_risposta"]);
            simpleTextContainer.innerHTML=data_risposta;
            rowItem.appendChild(simpleTextContainer);

            rowContainer.appendChild(rowItem);

            var simpleTextContainer=document.createElement("div");
            simpleTextContainer.setAttribute("class","simple-text-container");
            simpleTextContainer.setAttribute("style","text-overflow: ellipsis;");
            simpleTextContainer.innerHTML=risposta["descrizione"];
            rowContainer.appendChild(simpleTextContainer);

            var allegati_risposte=risposta["allegati"];

            if(allegati_risposte.length>0)
            {
                var allegatiRisposteContainer=document.createElement("div");
                allegatiRisposteContainer.setAttribute("class","file-container");
                allegatiRisposteContainer.setAttribute("style","margin-top:5px");

                allegati_risposte.forEach(function(allegato)
                {
                    var percorso=allegato.percorso;
                    var nomeFile= percorso.split("\\");
                    var nomeFile = nomeFile[nomeFile.length - 1];
                    var formato= nomeFile.split(".")[1];

                    var allegatiRisposteItem=document.createElement("div");
                    allegatiRisposteItem.setAttribute('onclick',"downloadAllegato('"+nomeFile+"')");
                    allegatiRisposteItem.setAttribute("class","file-container-item");
                    allegatiRisposteItem.innerHTML='<i class="fad fa-download"></i><span>'+nomeFile+'</span>';
                    allegatiRisposteContainer.appendChild(allegatiRisposteItem);
                });
                rowContainer.appendChild(allegatiRisposteContainer);
            }

            outerContainer.appendChild(rowContainer);

            c++;
        });
    }

    var id_utente=await getSessionValue("id_utente");
    if(view=="gestione_richieste" || infoRichiesta["utente_creazione"]==id_utente)
    {
        var containerInputReplica=document.createElement("div");
        containerInputReplica.setAttribute("class","row-container popup-dettagli-richiesta-element-risposte");
        containerInputReplica.setAttribute("id","containerInputReplica");

        var containerInputReplicaRow=document.createElement("div");
        containerInputReplicaRow.setAttribute("class","container-input-replica-row");
        containerInputReplicaRow.setAttribute("style","align-items: center");

        var textAreaDescrizione=document.createElement("textarea");
        textAreaDescrizione.setAttribute("id","popupRichiesteTextareaDescrizione");
        textAreaDescrizione.setAttribute("placeholder","Risposta...");
        containerInputReplicaRow.appendChild(textAreaDescrizione);
        
        var btnInserisciReplica=document.createElement("button");
        btnInserisciReplica.setAttribute("id","popupRichiesteBtnInserisciReplica");
        btnInserisciReplica.setAttribute("onclick","inserisciNuovaReplica(this,"+infoRichiesta['id_richiesta']+")");
        btnInserisciReplica.setAttribute("style","color:"+colorStato);
        btnInserisciReplica.innerHTML='<i class="fad fa-paper-plane"></i>';
        containerInputReplicaRow.appendChild(btnInserisciReplica);

        var btnAllegaFile=document.createElement("button");
        btnAllegaFile.setAttribute("id","popupRichiesteBtnInserisciAllegato");
        btnAllegaFile.setAttribute("onclick","document.getElementById('popupRichiesteInputInserisciAllegato').click()");
        btnAllegaFile.setAttribute("style","color:"+colorStato);
        btnAllegaFile.innerHTML='<i class="far fa-paperclip"></i>';
        containerInputReplicaRow.appendChild(btnAllegaFile);

        var inputAllegaFile=document.createElement("input");
        inputAllegaFile.setAttribute("type","file");
        inputAllegaFile.setAttribute("id","popupRichiesteInputInserisciAllegato");
        inputAllegaFile.setAttribute("style","display:none");
        inputAllegaFile.setAttribute("multiple","multiple");
        inputAllegaFile.setAttribute("onchange","getFilesRisposta(this)");
        containerInputReplicaRow.appendChild(inputAllegaFile);

        containerInputReplica.appendChild(containerInputReplicaRow);

        var containerInputReplicaRow=document.createElement("div");
        containerInputReplicaRow.setAttribute("class","container-input-replica-row");
        containerInputReplicaRow.setAttribute("id","containerAllegatiRisposta");
        containerInputReplicaRow.setAttribute("style","flex-wrap: wrap;");

        containerInputReplica.appendChild(containerInputReplicaRow);

        outerContainer.appendChild(containerInputReplica);
    }

    Swal.fire
    ({
        width:"100%",
        html: outerContainer.outerHTML,
        position:"top",
        showCloseButton: true,
        showConfirmButton:false,
        animation:animationSwal,
        allowOutsideClick:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-popup")[0].style.maxWidth="700px";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";

                    var closeButton=document.getElementsByClassName("swal2-close")[0];
                    document.getElementsByClassName("swal2-close")[0].remove();
                    closeButton.style.height="30px";
                    closeButton.style.width="30px";
                    closeButton.style.lineHeight="30px";
                    closeButton.style.top="auto";
                    closeButton.style.right="auto";
                    closeButton.style.position="static";
                    document.getElementById("popupDettagliRichiestaCloseButtonContainer").appendChild(closeButton);

                    if(view=="gestione_richieste")
                    {
                        $("#popupDettagliRichiestaSelectAggiungiUtentiCoinvolti").multipleSelect(
                            {
                                maxHeight:150,
                                placeholder:"Aggiungi",
                                onClose: function () 
                                        {
                                            var utentiSelezionati=$('#popupDettagliRichiestaSelectAggiungiUtentiCoinvolti').multipleSelect('getSelects');
                                            var JSONutentiSelezionati=JSON.stringify(utentiSelezionati);
                                            var id_richiesta=infoRichiesta["id_richiesta"];
                                            $.post("updateUtentiCoinvolti.php",
                                            {
                                                JSONutentiSelezionati,
                                                id_richiesta
                                            },
                                            function(response, status)
                                            {
                                                if(status=="success")
                                                {
                                                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                                                    {
                                                        Swal.fire
                                                        ({
                                                            icon: 'error',
                                                            title: 'Errore',
                                                            text: "Se il problema persiste contatta l' amministratore"
                                                        });
                                                        console.log(response);
                                                    }
                                                }
                                                else
                                                    console.log(status);
                                            });
                                        },
                                filter:true,
                                filterPlaceholder:"Cerca...",
                                locale:"it-IT"
                            });
                        $(".ms-choice").css({"font-family":"'Quicksand',sans-serif","font-size":"12px"});
                        $(".ms-drop").css({"font-family":"'Quicksand',sans-serif","font-size":"12px","text-align":"left"});
                    }
                    try {
                        initResizeTextarea();
                        document.getElementById('popupRichiesteTextareaDescrizione').style.height="30px";
                        var buttonsWidth=document.getElementById("popupRichiesteBtnInserisciAllegato").offsetWidth+document.getElementById("popupRichiesteBtnInserisciReplica").offsetWidth+20;
                        document.getElementById('popupRichiesteTextareaDescrizione').style.width="calc(100% - "+buttonsWidth+"px)";
                    } catch (error) {}
                    
                    if(display=="dettagli")
                        getDettagliRichiestaPopupDettagli('no',document.getElementById("popupDettagliRichiestaBtnDettagli"),colorStato);
                    if(display=='risposte')
                        getRisposteRichiestaPopupDettagli('no',document.getElementById("popupDettagliRichiestaBtnRisposte"),colorStato);

                    //$(".popup-dettagli-richiesta-outer-container").show("fast","swing");
                    $(".popup-dettagli-richiesta-outer-container").css({"display":"flex"});
                }
    }).then((result) => 
    {
        if (result.value)
        {
            
        }
    });
}
function cambiaStatoRichiesta(stato,button,id_richiesta)
{
    if(button!=null)
    {
        var oldButtonContent= button.innerHTML;
        button.innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
        button.disabled=true;
    }

    $.post("cambiaStatoRichiesta.php",
    {
        id_richiesta,
        stato
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
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
                if(button!=null)
                {
                    button.innerHTML=oldButtonContent;
                    button.disabled=false;
                }

                Swal.close();
                reQueryView();
            }
        }
        else
            console.log(status);
    });
}
async function inserisciNuovaReplica(button,id_richiesta)
{
    button.innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
    button.disabled=true;

    var descrizione=document.getElementById("popupRichiesteTextareaDescrizione").value;
    var id_utente=await getSessionValue("id_utente");
    var username=await getSessionValue("username");

    if(descrizione=="" && filesRisposta.length==0)
    {
        button.innerHTML='<i class="fad fa-paper-plane"></i>';
        button.disabled=false;
    }
    else
    {
        $.post("inserisciNuovaReplica.php",
        {
            id_richiesta,
            descrizione,
            id_utente,
            username
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    button.innerHTML='<i class="fad fa-exclamation-triangle"></i>';
                    setTimeout(function(){
                        button.innerHTML='<i class="fad fa-paper-plane"></i>';
                        button.disabled=false;
                    }, 3000);
                    console.log(response);
                }
                else
                {
                    var files = filesRisposta;
                    if(files.length>0)
                    {
                        var uploadedFiles=0;
                        
                        var fileNum=0;
                        for (var i = 0; i < files.length; i++)
                        {
                            var file=files[i];
                            var fileName=file.name;
                            var fileSize_kb= file.size;
                            var fileSize_mb=fileSize_kb/1000000;
                            if(fileSize_mb<90)
                            {
                                fileNum++;
                            }
                        }
                        if(fileNum>0)
                        {
                            for (var i = 0; i < files.length; i++)
                            {
                                var file=files[i];
                                var fileName=file.name;
                                var fileSize_kb= file.size;
                                var fileSize_mb=fileSize_kb/1000000;
                                if(fileSize_mb<90)
                                {
                                    var data= new FormData();
                                    data.append('file',file);
                                    data.append('id_utente',id_utente);
                                    data.append('id_richiesta',id_richiesta);
                                    data.append('fileNameResponse',fileName);
                                    $.ajax(
                                    {
                                        url:'uploadFileReplica.php',
                                        data:data,
                                        processData:false,
                                        contentType:false,
                                        type:'POST',
                                        success:function(response)
                                            {
                                                if(response.indexOf("ok")>-1)
                                                {
                                                    uploadedFiles++;

                                                    if(uploadedFiles==fileNum)
                                                    {
                                                        appendNuovaReplica(username,descrizione,id_richiesta,button);
                                                    }
                                                }
                                                else
                                                {
                                                    document.getElementById("containerAllegatiRisposta").innerHTML="";
                                                    var alertFileSize=document.createElement("div");
                                                    alertFileSize.setAttribute("id","containerAllegatiRispostaAlertFileSize");
                                                    alertFileSize.innerHTML='Non è stato possibile caricare alcuni file';
                                                    document.getElementById("containerAllegatiRisposta").appendChild(alertFileSize);
                                                    
                                                    setTimeout(function(){
                                                        appendNuovaReplica(username,descrizione,id_richiesta,button);
                                                    }, 3000);
                                                }
                                            }
                                    });
                                }
                            }
                        }
                        else
                        {
                            appendNuovaReplica(username,descrizione,id_richiesta,button);
                        }
                    }
                    else
                    {
                        appendNuovaReplica(username,descrizione,id_richiesta,button);
                    }
                }
            }
            else
                reject({status});
        });
    }
}
function getIdMacrocategoria(id_richiesta)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getIdMacrocategoria.php",
        {
            id_richiesta
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                reject({status});
        });
    });
}
function getUtenteCreazione(id_richiesta)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getUtenteCreazione.php",
        {
            id_richiesta
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                reject({status});
        });
    });
}
function getUtentiCoinvoltiEUtentiMacrocategoria(id_richiesta,id_macrocategoria)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getUtentiCoinvoltiEUtentiMacrocategoria.php",
        {
            id_richiesta,
            id_macrocategoria
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function getMailsByServerSideSetting(utentiInvioMail,serverSideSetting,subject,body)
{
    var JSONutentiInvioMail=JSON.stringify(utentiInvioMail);
    $.get("getMailsByServerSideSetting.php",
    {
        JSONutentiInvioMail,
        serverSideSetting
    },
    function(response, status)
    {
        if(status=="success")
        {
            var mails=JSON.parse(response);
            //console.log(mails);
            if(mails.length>0)
                sendMail(mails.join(";"),subject,body);
        }
        else
            console.log(status);
    });
}
async function appendNuovaReplica(username_risposta,descrizione,id_richiesta,button)
{
    var id_macrocategoria=await getIdMacrocategoria(id_richiesta); 
    var utentiInvioMailObj=await getUtentiCoinvoltiEUtentiMacrocategoria(id_richiesta,id_macrocategoria);
    var utentiInvioMail=[];
    utentiInvioMailObj.forEach(function(utenteObj)
    {
        utentiInvioMail.push(utenteObj.id_utente);
    });
    var subject="Nuova risposta di "+username_risposta+" alla richiesta codice "+id_richiesta;
    var body="Testo: "+descrizione+". Consulta la pagina http://remote.oasisgroup.it/oasis/redirect.php?page=gestione_richieste";
    getMailsByServerSideSetting(utentiInvioMail,"checkboxRiceviMailPerOgniRispostaRichiestaIncaricato",subject,body);
    
    setTimeout(async function()
    {
        var utenteCreazione=await getUtenteCreazione(id_richiesta);
        var id_utente=await getSessionValue("id_utente");
        if(utenteCreazione==id_utente)
            var utentiInvioMail=[];
        else
            var utentiInvioMail=[utenteCreazione];
        var subject="Nuova risposta di "+username_risposta+" alla tua richiesta codice "+id_richiesta;
        var body="Testo: "+descrizione+". Consulta la pagina http://remote.oasisgroup.it/oasis/redirect.php?page=richieste";
        getMailsByServerSideSetting(utentiInvioMail,"checkboxRiceviMailPerOgniRispostaTuaRichiesta",subject,body);
    }, 10000);

    /*button.innerHTML='<i class="fad fa-paper-plane"></i>';
    button.disabled=false;
    document.getElementById("popupRichiesteTextareaDescrizione").value="";
    document.getElementById("containerAllegatiRisposta").innerHTML="";*/

    var oldInfoRichiesta=getFirstObjByPropValue(infoRichieste,"id_richiesta",id_richiesta);
    var indexOldInfoRichiesta=infoRichieste.indexOf(oldInfoRichiesta);
    infoRichieste.splice(indexOldInfoRichiesta, 1);

    var infoRichiesta=await getInfoRichiesta(id_richiesta);

    infoRichieste.push(infoRichiesta);

    if(infoRichiesta["stato"]=="Aperta")
    {
        cambiaStatoRichiesta("Presa in carico",null,infoRichiesta.id_richiesta)
    }

    var risposte=infoRichiesta["risposte"];
    var id_risposte=[];
    risposte.forEach(function(risposta)
    {
        id_risposte.push(risposta["id_risposta"]);
    });
    var maxId_risposta=Math.max.apply(null, id_risposte);
    var nuovaRisposta=getFirstObjByPropValue(risposte,"id_risposta",maxId_risposta);

    var c=risposte.length-1;

    var rowContainerBackground="white";
    if(isOdd(c))
    {
        switch(infoRichiesta["stato"])
        {
            case "Aperta":var rowContainerBackground="rgba(218, 105, 105, 0.35)";;break;
            case "Presa in carico":var rowContainerBackground="rgba(76, 145, 203, 0.35)";;break;
            case "In attesa di chiusura":var rowContainerBackground="rgba(233, 169, 58, 0.35)";;break;
            case "Chiusa":var rowContainerBackground="rgba(112, 176, 133, 0.35)";;break;
        }
    }

    var rowContainerPaddingTop="5px;";
    if(c==0)
        var rowContainerPaddingTop="0px";
    
    var rowContainerMarginTop="0px;";
    if(c==0)
        var rowContainerMarginTop="10px";
    
    var rowContainer=document.createElement("div");
    rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-risposte");
    rowContainer.setAttribute("style","margin-top:"+rowContainerMarginTop+";padding-top:"+rowContainerPaddingTop+";padding-bottom:5px;flex-direction: column;background-color:"+rowContainerBackground);
    
    var rowItem=document.createElement("div");
    rowItem.setAttribute("style","display:flex;flex-direction:row;margin-bottom:5px");

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","font-weight:bold;width:50%;text-align:left");
    simpleTextContainer.innerHTML=nuovaRisposta["username_utente_risposta"];
    rowItem.appendChild(simpleTextContainer);

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","color:gray;width:50%;text-align:right");
    var data_risposta=getDatetimeString(nuovaRisposta["data_risposta"]);
    simpleTextContainer.innerHTML=data_risposta;
    rowItem.appendChild(simpleTextContainer);

    rowContainer.appendChild(rowItem);

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","text-overflow: ellipsis;");
    simpleTextContainer.innerHTML=nuovaRisposta["descrizione"];
    rowContainer.appendChild(simpleTextContainer);

    var allegati_risposte=nuovaRisposta["allegati"];

    if(allegati_risposte.length>0)
    {
        var allegatiRisposteContainer=document.createElement("div");
        allegatiRisposteContainer.setAttribute("class","file-container");
        allegatiRisposteContainer.setAttribute("style","margin-top:5px");

        allegati_risposte.forEach(function(allegato)
        {
            var percorso=allegato.percorso;
            var nomeFile= percorso.split("\\");
            var nomeFile = nomeFile[nomeFile.length - 1];
            var formato= nomeFile.split(".")[1];

            var allegatiRisposteItem=document.createElement("div");
            allegatiRisposteItem.setAttribute('onclick',"downloadAllegato('"+nomeFile+"')");
            allegatiRisposteItem.setAttribute("class","file-container-item");
            allegatiRisposteItem.innerHTML='<i class="fad fa-download"></i><span>'+nomeFile+'</span>';
            allegatiRisposteContainer.appendChild(allegatiRisposteItem);
        });
        rowContainer.appendChild(allegatiRisposteContainer);
    }

    var outerContainer=document.getElementsByClassName("popup-dettagli-richiesta-outer-container")[0];
    outerContainer.insertBefore(rowContainer,document.getElementById("containerInputReplica"));

    button.innerHTML='<i class="fad fa-paper-plane"></i>';
    button.disabled=false;
    document.getElementById("popupRichiesteTextareaDescrizione").value="";
    document.getElementById("containerAllegatiRisposta").innerHTML="";

    filesRisposta=[];
}
function getFilesRisposta(input)
{
    var container=document.getElementById("containerAllegatiRisposta");
    container.innerHTML="";

    var files = input.files;
    filesRisposta=[];
    var nFilesRisposta=0;

    if(files.length>0)
    {
        for (var i = 0; i < files.length; i++)
        {
            
            var file=files[i];
            var fileName=file.name;
            var fileSize_kb= file.size;
            var fileSize_mb=fileSize_kb/1000000;
            if(fileSize_mb<90)
            {
                filesRisposta.push(file);

                var containerAllegatiRispostaItem=document.createElement("div");
                containerAllegatiRispostaItem.setAttribute("onclick","rimuoviAllegatiRispostaItem(this,"+nFilesRisposta+")");
                containerAllegatiRispostaItem.setAttribute("class","container-allegati-risposta-item");
                containerAllegatiRispostaItem.innerHTML='<i class="fad fa-file"></i><span>'+fileName+'</span>';
                container.appendChild(containerAllegatiRispostaItem);

                nFilesRisposta++;
            }
        }
        if(filesRisposta.length!=files.length)
        {
            var alertFileSize=document.createElement("div");
            alertFileSize.setAttribute("id","containerAllegatiRispostaAlertFileSize");
            alertFileSize.innerHTML='Alcuni file sono stati rimossi (dimensione massima 90MB)';
            container.insertBefore(alertFileSize, container.childNodes[0]);
        }
    }
}
function rimuoviAllegatiRispostaItem(item,n)
{
    item.remove();
    filesRisposta.splice(n, 1);
    if(filesRisposta.length==0)
    {
        try {
            document.getElementById("containerAllegatiRispostaAlertFileSize").remove();
        } catch (error) {}
    }
}
var observeTextarea;
if (window.attachEvent) {
    observeTextarea = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
}
else {
    observeTextarea = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}
function initResizeTextarea () {
    var text = document.getElementById('popupRichiesteTextareaDescrizione');
    function resizeTextarea () {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight+'px';
    }
    /* 0-timeout to get the already changed text */
    function delayedResizeTextarea () {
        window.setTimeout(resizeTextarea, 0);
    }
    observeTextarea(text, 'change',  resizeTextarea);
    observeTextarea(text, 'cut',     delayedResizeTextarea);
    observeTextarea(text, 'paste',   delayedResizeTextarea);
    observeTextarea(text, 'drop',    delayedResizeTextarea);
    observeTextarea(text, 'keydown', delayedResizeTextarea);

    text.focus();
    text.select();
    resizeTextarea();
}
function downloadAllegato(nomeFile)
{
    window.open("http://remote.oasisgroup.it/OasisAllegatiRichieste/download.php?nomeFile="+nomeFile , '_blank');
}
function getExtraColumns(id_macrocategoria)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getExtraColumnsRichiesta.php",
        {
            id_macrocategoria
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function getDettagliRichiestaPopupDettagli(animation,button,colorStato)
{
    button.style.backgroundColor=colorStato;
    button.style.textDecoration="underline";
    document.getElementById("popupDettagliRichiestaBtnRisposte").style.backgroundColor="white";
    document.getElementById("popupDettagliRichiestaBtnRisposte").style.textDecoration="none";

    if(animation=="si")
        $(".popup-dettagli-richiesta-element-risposte").hide("fast","swing");
    else
        $(".popup-dettagli-richiesta-element-risposte").hide(true);

    if(animation=="si")
        $(".popup-dettagli-richiesta-element-dettagli").show("fast","swing");
    else
        $(".popup-dettagli-richiesta-element-dettagli").show(true);

    $(".popup-dettagli-richiesta-element-dettagli").css("display","flex");
}
function getRisposteRichiestaPopupDettagli(animation,button,colorStato)
{
    button.style.backgroundColor=colorStato;
    button.style.textDecoration="underline";
    document.getElementById("popupDettagliRichiestaBtnDettagli").style.backgroundColor="white";
    document.getElementById("popupDettagliRichiestaBtnDettagli").style.textDecoration="none";

    if(animation=="si")
        $(".popup-dettagli-richiesta-element-dettagli").hide("fast","swing");
    else
        $(".popup-dettagli-richiesta-element-dettagli").hide(true);

    if(animation=="si")
        $(".popup-dettagli-richiesta-element-risposte").show("fast","swing");
    else
        $(".popup-dettagli-richiesta-element-risposte").show(true);

    $(".popup-dettagli-richiesta-element-risposte").css("display","flex");
}
function isOdd(num) { return num % 2;}
function getFirstObjByPropValue(array,prop,propValue)
{
    var return_item;
    array.forEach(function(item)
    {
        if(item[prop]==propValue)
        {
            return_item= item;
        }
    });
    return return_item;
}
function getDatetimeString(datetime)
{
    var data_ora_eng=datetime.date.split(".")[0];
    var data_eng=data_ora_eng.split(" ")[0];
    var data_anno=data_eng.split("-")[0];
    var data_mese=data_eng.split("-")[1];
    var data_giorno=data_eng.split("-")[2];
    var data_ita=data_giorno+"/"+data_mese+"/"+data_anno;
    var ora=data_ora_eng.split(" ")[1];
    var datetime_string=data_ita+" "+ora;

    return datetime_string;
}

var checkboxMostraIdentificativoRichiesta;
var checkboxRicordaFiltriAlProssimoAccesso;
var filterStato=[];
var filterMacrocategoria=[];
var filterUtente=[];
var checkboxOnloadTutteLeRichieste;
var checkboxOnloadGestioneRichieste;
var checkboxRiceviMailPerOgniNuovaRichiesta;
var checkboxRiceviMailPerOgniRispostaRichiestaIncaricato;
var checkboxRiceviMailPerOgniRispostaTuaRichiesta;

async function setServerSideSetting(name,value,id_utente)
{
    if(id_utente==undefined)
        var id_utente=await getSessionValue("id_utente");
    $.post("setServerSideSetting.php",{name,value,id_utente},
    function(response, status)
    {
        if(status!="success")
            console.log(status);
    });
}
async function getServerSideSetting(name,id_utente)
{
    if(id_utente==undefined)
        var id_utente=await getSessionValue("id_utente");
    return new Promise(function (resolve, reject) 
    {
        $.get("getServerSideSetting.php",{name,id_utente},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                reject({status});
        });
    });
}
function getDefaultServerSideSetting(name)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getDefaultServerSideSetting.php",{name},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                reject({status});
        });
    });
}
async function checkServerSideSettings()
{
    return new Promise(async function (resolve) 
    {
        var serverSideSettingCheckboxRiceviMailPerOgniNuovaRichiesta=await getServerSideSetting("checkboxRiceviMailPerOgniNuovaRichiesta");
        if(serverSideSettingCheckboxRiceviMailPerOgniNuovaRichiesta=="")
        {
            var defaultServerSideSetting=await getDefaultServerSideSetting('checkboxRiceviMailPerOgniNuovaRichiesta');
            if(defaultServerSideSetting.indexOf("true")>-1)
                checkboxRiceviMailPerOgniNuovaRichiesta=true;
            if(defaultServerSideSetting.indexOf("false")>-1)
                checkboxRiceviMailPerOgniNuovaRichiesta=false;
        }
        if(serverSideSettingCheckboxRiceviMailPerOgniNuovaRichiesta.indexOf("true")>-1)
            checkboxRiceviMailPerOgniNuovaRichiesta=true;
        if(serverSideSettingCheckboxRiceviMailPerOgniNuovaRichiesta.indexOf("false")>-1)
            checkboxRiceviMailPerOgniNuovaRichiesta=false;

        var serverSideSettingCheckboxRiceviMailPerOgniRispostaRichiestaIncaricato=await getServerSideSetting("checkboxRiceviMailPerOgniRispostaRichiestaIncaricato");
        if(serverSideSettingCheckboxRiceviMailPerOgniRispostaRichiestaIncaricato=="")
        {
            var defaultServerSideSetting=await getDefaultServerSideSetting('checkboxRiceviMailPerOgniRispostaRichiestaIncaricato');
            if(defaultServerSideSetting.indexOf("true")>-1)
                checkboxRiceviMailPerOgniRispostaRichiestaIncaricato=true;
            if(defaultServerSideSetting.indexOf("false")>-1)
                checkboxRiceviMailPerOgniRispostaRichiestaIncaricato=false;
        }
        if(serverSideSettingCheckboxRiceviMailPerOgniRispostaRichiestaIncaricato.indexOf("true")>-1)
            checkboxRiceviMailPerOgniRispostaRichiestaIncaricato=true;
        if(serverSideSettingCheckboxRiceviMailPerOgniRispostaRichiestaIncaricato.indexOf("false")>-1)
            checkboxRiceviMailPerOgniRispostaRichiestaIncaricato=false;

        var serverSideSettingCheckboxRiceviMailPerOgniRispostaTuaRichiesta=await getServerSideSetting("checkboxRiceviMailPerOgniRispostaTuaRichiesta");
        if(serverSideSettingCheckboxRiceviMailPerOgniRispostaTuaRichiesta=="")
        {
            var defaultServerSideSetting=await getDefaultServerSideSetting('checkboxRiceviMailPerOgniRispostaTuaRichiesta');
            if(defaultServerSideSetting.indexOf("true")>-1)
                checkboxRiceviMailPerOgniRispostaTuaRichiesta=true;
            if(defaultServerSideSetting.indexOf("false")>-1)
                checkboxRiceviMailPerOgniRispostaTuaRichiesta=false;
        }
        if(serverSideSettingCheckboxRiceviMailPerOgniRispostaTuaRichiesta.indexOf("true")>-1)
            checkboxRiceviMailPerOgniRispostaTuaRichiesta=true;
        if(serverSideSettingCheckboxRiceviMailPerOgniRispostaTuaRichiesta.indexOf("false")>-1)
            checkboxRiceviMailPerOgniRispostaTuaRichiesta=false;

        resolve(true);
    });
}
async function checkCookieSettings()
{
    return new Promise(async function (resolve) 
    {
        var coockieCheckboxMostraIdentificativoRichiesta=await getCookie("checkboxMostraIdentificativoRichiesta");
        if(coockieCheckboxMostraIdentificativoRichiesta=="")
            checkboxMostraIdentificativoRichiesta=false;
        if(coockieCheckboxMostraIdentificativoRichiesta.indexOf("true")>-1)
            checkboxMostraIdentificativoRichiesta=true;
        if(coockieCheckboxMostraIdentificativoRichiesta.indexOf("false")>-1)
            checkboxMostraIdentificativoRichiesta=false;

        var coockieCheckboxRicordaFiltriAlProssimoAccesso=await getCookie("checkboxRicordaFiltriAlProssimoAccesso");
        if(coockieCheckboxRicordaFiltriAlProssimoAccesso=="")
            checkboxRicordaFiltriAlProssimoAccesso=true;
        if(coockieCheckboxRicordaFiltriAlProssimoAccesso.indexOf("true")>-1)
            checkboxRicordaFiltriAlProssimoAccesso=true;
        if(coockieCheckboxRicordaFiltriAlProssimoAccesso.indexOf("false")>-1)
            checkboxRicordaFiltriAlProssimoAccesso=false;

        var coockieFilterStato=await getCookie("filterStato");
        if(coockieFilterStato!="")
            filterStato=coockieFilterStato.split(",");
        
        var coockieFilterMacrocategoria=await getCookie("filterMacrocategoria");
            if(coockieFilterMacrocategoria!="")
                filterMacrocategoria=coockieFilterMacrocategoria.split(",");

        var coockieFilterUtente=await getCookie("filterUtente");
        if(coockieFilterUtente!="")
            filterUtente=coockieFilterUtente.split(",");
        
        var coockieCheckboxOnloadTutteLeRichieste=await getCookie("checkboxOnloadTutteLeRichieste");
        if(coockieCheckboxOnloadTutteLeRichieste=="")
            checkboxOnloadTutteLeRichieste=true;
        if(coockieCheckboxOnloadTutteLeRichieste.indexOf("true")>-1)
            checkboxOnloadTutteLeRichieste=true;
        if(coockieCheckboxOnloadTutteLeRichieste.indexOf("false")>-1)
            checkboxOnloadTutteLeRichieste=false;
        
        var coockieCheckboxOnloadGestioneRichieste=await getCookie("checkboxOnloadGestioneRichieste");
        if(coockieCheckboxOnloadGestioneRichieste=="")
            checkboxOnloadGestioneRichieste=false;
        if(coockieCheckboxOnloadGestioneRichieste.indexOf("true")>-1)
            checkboxOnloadGestioneRichieste=true;
        if(coockieCheckboxOnloadGestioneRichieste.indexOf("false")>-1)
            checkboxOnloadGestioneRichieste=false;
        
        resolve(true);
    });
}
function getPopupImpostazioni()
{
    var table=document.createElement("table");
    table.setAttribute("class","material-design-table-dark");

    //tbody
    var tbody = table.createTBody();

    //Mostra id richieste
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var labelMostraIdentificativoRichiesta=document.createElement("label");
    labelMostraIdentificativoRichiesta.setAttribute("class","pure-material-checkbox");

    var inputMostraIdentificativoRichiesta=document.createElement("input");
    inputMostraIdentificativoRichiesta.setAttribute("type","checkbox");
    if(checkboxMostraIdentificativoRichiesta)
        inputMostraIdentificativoRichiesta.setAttribute("checked","checked");
    inputMostraIdentificativoRichiesta.setAttribute("id","checkboxMostraIdentificativoRichiesta");
    inputMostraIdentificativoRichiesta.setAttribute("onchange","checkboxMostraIdentificativoRichiesta=this.checked;setCookie('checkboxMostraIdentificativoRichiesta',this.checked);reQueryView()");
    labelMostraIdentificativoRichiesta.appendChild(inputMostraIdentificativoRichiesta);

    var spanMostraIdentificativoRichiesta=document.createElement("span");
    spanMostraIdentificativoRichiesta.setAttribute("style","color:white");
    spanMostraIdentificativoRichiesta.innerHTML="<div>Mostra id richieste</div>";
    labelMostraIdentificativoRichiesta.appendChild(spanMostraIdentificativoRichiesta);

    cell1.appendChild(labelMostraIdentificativoRichiesta);

    //Ricorda filtri
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var labelRicordaFiltriAlProssimoAccesso=document.createElement("label");
    labelRicordaFiltriAlProssimoAccesso.setAttribute("class","pure-material-checkbox");

    var inputRicordaFiltriAlProssimoAccesso=document.createElement("input");
    inputRicordaFiltriAlProssimoAccesso.setAttribute("type","checkbox");
    if(checkboxRicordaFiltriAlProssimoAccesso)
        inputRicordaFiltriAlProssimoAccesso.setAttribute("checked","checked");
    inputRicordaFiltriAlProssimoAccesso.setAttribute("id","checkboxRicordaFiltriAlProssimoAccesso");
    inputRicordaFiltriAlProssimoAccesso.setAttribute("onchange","checkboxRicordaFiltriAlProssimoAccesso=this.checked;setCookie('checkboxRicordaFiltriAlProssimoAccesso',this.checked);cleanCookieFiltri()");
    labelRicordaFiltriAlProssimoAccesso.appendChild(inputRicordaFiltriAlProssimoAccesso);

    var spanRicordaFiltriAlProssimoAccesso=document.createElement("span");
    spanRicordaFiltriAlProssimoAccesso.setAttribute("style","color:white");
    spanRicordaFiltriAlProssimoAccesso.innerHTML="Ricorda filtri al prossimo accesso";
    labelRicordaFiltriAlProssimoAccesso.appendChild(spanRicordaFiltriAlProssimoAccesso);

    cell1.appendChild(labelRicordaFiltriAlProssimoAccesso);

    //Tutte le richieste vs gestione richieste
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var labelOnloadTutteLeRichieste=document.createElement("label");
    labelOnloadTutteLeRichieste.setAttribute("class","material-radio-button-container");
    labelOnloadTutteLeRichieste.innerHTML="Mostra subito tutte le richieste";

    var inputOnloadTutteLeRichieste=document.createElement("input");
    inputOnloadTutteLeRichieste.setAttribute("type","radio");
    inputOnloadTutteLeRichieste.setAttribute("name","OnloadTutteLeRichiesteOnloadGestioneRichieste");
    if(checkboxOnloadTutteLeRichieste)
        inputOnloadTutteLeRichieste.setAttribute("checked","checked");
    inputOnloadTutteLeRichieste.setAttribute("id","checkboxOnloadTutteLeRichieste");
    inputOnloadTutteLeRichieste.setAttribute("onchange","checkboxOnloadTutteLeRichieste=this.checked;setCookie('checkboxOnloadTutteLeRichieste',this.checked);setCookie('checkboxOnloadGestioneRichieste',!this.checked)");
    labelOnloadTutteLeRichieste.appendChild(inputOnloadTutteLeRichieste);

    var spanOnloadTutteLeRichieste=document.createElement("span");
    spanOnloadTutteLeRichieste.setAttribute("style","color:white");
    spanOnloadTutteLeRichieste.setAttribute("class","material-radio-button-checkmark");
    labelOnloadTutteLeRichieste.appendChild(spanOnloadTutteLeRichieste);

    cell1.appendChild(labelOnloadTutteLeRichieste);

    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var labelOnloadGestioneRichieste=document.createElement("label");
    labelOnloadGestioneRichieste.setAttribute("class","material-radio-button-container");
    labelOnloadGestioneRichieste.innerHTML="Mostra subito gestione richieste";

    var inputOnloadGestioneRichieste=document.createElement("input");
    inputOnloadGestioneRichieste.setAttribute("type","radio");
    inputOnloadGestioneRichieste.setAttribute("name","OnloadTutteLeRichiesteOnloadGestioneRichieste");
    if(checkboxOnloadGestioneRichieste)
        inputOnloadGestioneRichieste.setAttribute("checked","checked");
    inputOnloadGestioneRichieste.setAttribute("id","checkboxOnloadGestioneRichieste");
    inputOnloadGestioneRichieste.setAttribute("onchange","checkboxOnloadGestioneRichieste=this.checked;setCookie('checkboxOnloadGestioneRichieste',this.checked);setCookie('checkboxOnloadTutteLeRichieste',!this.checked)");
    labelOnloadGestioneRichieste.appendChild(inputOnloadGestioneRichieste);

    var spanOnloadGestioneRichieste=document.createElement("span");
    spanOnloadGestioneRichieste.setAttribute("style","color:white");
    spanOnloadGestioneRichieste.setAttribute("class","material-radio-button-checkmark");
    labelOnloadGestioneRichieste.appendChild(spanOnloadGestioneRichieste);

    cell1.appendChild(labelOnloadGestioneRichieste);

    //Ricevi una mail di notifica per ogni richiesta in cui sei coinvolto
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var labelRiceviMailPerOgniNuovaRichiesta=document.createElement("label");
    labelRiceviMailPerOgniNuovaRichiesta.setAttribute("class","pure-material-checkbox");

    var inputRiceviMailPerOgniNuovaRichiesta=document.createElement("input");
    inputRiceviMailPerOgniNuovaRichiesta.setAttribute("type","checkbox");
    if(checkboxRiceviMailPerOgniNuovaRichiesta)
        inputRiceviMailPerOgniNuovaRichiesta.setAttribute("checked","checked");
    inputRiceviMailPerOgniNuovaRichiesta.setAttribute("id","checkboxRiceviMailPerOgniNuovaRichiesta");
    inputRiceviMailPerOgniNuovaRichiesta.setAttribute("onchange","checkboxRiceviMailPerOgniNuovaRichiesta=this.checked;setServerSideSetting('checkboxRiceviMailPerOgniNuovaRichiesta',this.checked);");
    labelRiceviMailPerOgniNuovaRichiesta.appendChild(inputRiceviMailPerOgniNuovaRichiesta);

    var spanRiceviMailPerOgniNuovaRichiesta=document.createElement("span");
    spanRiceviMailPerOgniNuovaRichiesta.setAttribute("style","color:white");
    spanRiceviMailPerOgniNuovaRichiesta.innerHTML="<div>Ricevi una mail di notifica per ogni richiesta in cui sei coinvolto</div>";
    labelRiceviMailPerOgniNuovaRichiesta.appendChild(spanRiceviMailPerOgniNuovaRichiesta);

    cell1.appendChild(labelRiceviMailPerOgniNuovaRichiesta);

    //Ricevi una mail di notifica per ogni risposta data ad una richiesta in cui sei coinvolto
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var labelRiceviMailPerOgniRispostaRichiestaIncaricato=document.createElement("label");
    labelRiceviMailPerOgniRispostaRichiestaIncaricato.setAttribute("class","pure-material-checkbox");

    var inputRiceviMailPerOgniRispostaRichiestaIncaricato=document.createElement("input");
    inputRiceviMailPerOgniRispostaRichiestaIncaricato.setAttribute("type","checkbox");
    if(checkboxRiceviMailPerOgniRispostaRichiestaIncaricato)
        inputRiceviMailPerOgniRispostaRichiestaIncaricato.setAttribute("checked","checked");
    inputRiceviMailPerOgniRispostaRichiestaIncaricato.setAttribute("id","checkboxRiceviMailPerOgniRispostaRichiestaIncaricato");
    inputRiceviMailPerOgniRispostaRichiestaIncaricato.setAttribute("onchange","checkboxRiceviMailPerOgniRispostaRichiestaIncaricato=this.checked;setServerSideSetting('checkboxRiceviMailPerOgniRispostaRichiestaIncaricato',this.checked);");
    labelRiceviMailPerOgniRispostaRichiestaIncaricato.appendChild(inputRiceviMailPerOgniRispostaRichiestaIncaricato);

    var spanRiceviMailPerOgniRispostaRichiestaIncaricato=document.createElement("span");
    spanRiceviMailPerOgniRispostaRichiestaIncaricato.setAttribute("style","color:white");
    spanRiceviMailPerOgniRispostaRichiestaIncaricato.innerHTML="<div>Ricevi una mail di notifica per ogni risposta data ad una richiesta in cui sei coinvolto</div>";
    labelRiceviMailPerOgniRispostaRichiestaIncaricato.appendChild(spanRiceviMailPerOgniRispostaRichiestaIncaricato);

    cell1.appendChild(labelRiceviMailPerOgniRispostaRichiestaIncaricato);

    //Ricevi una mail di notifica per ogni risposta data ad una tua richiesta
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var labelRiceviMailPerOgniRispostaTuaRichiesta=document.createElement("label");
    labelRiceviMailPerOgniRispostaTuaRichiesta.setAttribute("class","pure-material-checkbox");

    var inputRiceviMailPerOgniRispostaTuaRichiesta=document.createElement("input");
    inputRiceviMailPerOgniRispostaTuaRichiesta.setAttribute("type","checkbox");
    if(checkboxRiceviMailPerOgniRispostaTuaRichiesta)
        inputRiceviMailPerOgniRispostaTuaRichiesta.setAttribute("checked","checked");
    inputRiceviMailPerOgniRispostaTuaRichiesta.setAttribute("id","checkboxRiceviMailPerOgniRispostaTuaRichiesta");
    inputRiceviMailPerOgniRispostaTuaRichiesta.setAttribute("onchange","checkboxRiceviMailPerOgniRispostaTuaRichiesta=this.checked;setServerSideSetting('checkboxRiceviMailPerOgniRispostaTuaRichiesta',this.checked);");
    labelRiceviMailPerOgniRispostaTuaRichiesta.appendChild(inputRiceviMailPerOgniRispostaTuaRichiesta);

    var spanRiceviMailPerOgniRispostaTuaRichiesta=document.createElement("span");
    spanRiceviMailPerOgniRispostaTuaRichiesta.setAttribute("style","color:white");
    spanRiceviMailPerOgniRispostaTuaRichiesta.innerHTML="<div>Ricevi una mail di notifica per ogni risposta data ad una tua richiesta</div>";
    labelRiceviMailPerOgniRispostaTuaRichiesta.appendChild(spanRiceviMailPerOgniRispostaTuaRichiesta);

    cell1.appendChild(labelRiceviMailPerOgniRispostaTuaRichiesta);

    //Ripristina impostazioni predefinite
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var buttonRipristinaImpostazioniPredefinite=document.createElement("button");
    buttonRipristinaImpostazioniPredefinite.setAttribute("class","material-design-table-dark-button-reset-settings");
    buttonRipristinaImpostazioniPredefinite.setAttribute("onclick","ripristinaImpostazioniPredefinite()");
    buttonRipristinaImpostazioniPredefinite.innerHTML="Ripristina impostazioni predefinite";

    cell1.appendChild(buttonRipristinaImpostazioniPredefinite);

    //------------------------------------------------------------------------------------
    Swal.fire
    ({
        title: 'Impostazioni richieste',
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
async function ripristinaImpostazioniPredefinite()
{
    setCookie('checkboxMostraIdentificativoRichiesta',"");
    setCookie('checkboxRicordaFiltriAlProssimoAccesso',"");
    setCookie('checkboxOnloadTutteLeRichieste',"");
    setCookie('checkboxOnloadGestioneRichieste',"");
    var defaultServerSideSetting=await getDefaultServerSideSetting('checkboxRiceviMailPerOgniNuovaRichiesta');
    setServerSideSetting('checkboxRiceviMailPerOgniNuovaRichiesta',defaultServerSideSetting);
    var defaultServerSideSetting=await getDefaultServerSideSetting('checkboxRiceviMailPerOgniRispostaRichiestaIncaricato');
    setServerSideSetting('checkboxRiceviMailPerOgniRispostaRichiestaIncaricato',defaultServerSideSetting);
    var defaultServerSideSetting=await getDefaultServerSideSetting('checkboxRiceviMailPerOgniRispostaTuaRichiesta');
    setServerSideSetting('checkboxRiceviMailPerOgniRispostaTuaRichiesta',defaultServerSideSetting);

    cleanCookieFiltri();

    location.reload();
}
async function getPopupFiltri()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","outer-container-popup-filtri-richieste");
    outerContainer.setAttribute("id","outerContainerPopupFiltriRichieste");

    //Stato
    var selectContainer=document.createElement("div");
    selectContainer.setAttribute("class","select-container-popup-filtri-richieste");

    var selectLabel=document.createElement("div");
    selectLabel.innerHTML="Stato";

    selectContainer.appendChild(selectLabel);

    var select=document.createElement("select");
    select.setAttribute("id","multipleSelectStatoRichiesteMobile");
    select.setAttribute("multiple","multiple");

    var stati=
    [
        {
            value:"In attesa di chiusura",
            label:"In attesa di chiusura"
        },
        {
            value:"Presa in carico",
            label:"Presa in carico"
        },
        {
            value:"Aperta",
            label:"Aperta"
        },
        {
            value:"Chiusa",
            label:"Chiusa"
        }
    ];
    stati.forEach(function(item)
    {
        var option=document.createElement("option");
        option.setAttribute("value",item.value);
        if(filterStato.includes(item.value))
            option.setAttribute("selected","selected");
        option.innerHTML=item.label;
        select.appendChild(option);
    });

    selectContainer.appendChild(select);

    outerContainer.appendChild(selectContainer);

    //Macrocategorie
    var selectContainer=document.createElement("div");
    selectContainer.setAttribute("class","select-container-popup-filtri-richieste");

    var selectLabel=document.createElement("div");
    selectLabel.innerHTML="Area di competenza";

    selectContainer.appendChild(selectLabel);

    var select=document.createElement("select");
    select.setAttribute("id","multipleSelectMacrocategoriaRichiesteMobile");
    select.setAttribute("multiple","multiple");

    var macrocategorie=await getMacrocategorie();
    macrocategorie.forEach(function(item)
    {
        var option=document.createElement("option");
        option.setAttribute("value",item.value);
        if(filterMacrocategoria.includes(item.value) || filterMacrocategoria.includes(item.value.toString()))
            option.setAttribute("selected","selected");
        option.innerHTML=item.label;
        select.appendChild(option);
    });

    selectContainer.appendChild(select);

    outerContainer.appendChild(selectContainer);

    //Utenti
    var selectContainer=document.createElement("div");
    selectContainer.setAttribute("class","select-container-popup-filtri-richieste");

    var selectLabel=document.createElement("div");
    selectLabel.innerHTML="Utenti (solo per [Tutte le richieste])";

    selectContainer.appendChild(selectLabel);

    var select=document.createElement("select");
    select.setAttribute("id","multipleSelectUtenteRichiesteMobile");
    select.setAttribute("multiple","multiple");

    var utenti=await getUtenti();
    utenti.forEach(function(item)
    {
        var option=document.createElement("option");
        option.setAttribute("value",item.value);
        if(filterUtente.includes(item.value) || filterUtente.includes(item.value.toString()))
            option.setAttribute("selected","selected");
        option.innerHTML=item.label;
        select.appendChild(option);
    });

    selectContainer.appendChild(select);

    outerContainer.appendChild(selectContainer);

    Swal.fire
    ({
        title: 'Filtri richieste',
        width:"100%",
        position:"top",
        html: outerContainer.outerHTML,
        showCloseButton: true,
        showConfirmButton:true,
        confirmButtonText:"Applica",
        onOpen : function()
        {
            document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
            $('#multipleSelectStatoRichiesteMobile').multipleSelect({filter:true,filterPlaceholder:"Cerca...",locale:"it-IT",maxHeight:1000,onClose: function () {document.getElementById("outerContainerPopupFiltriRichieste").style.height="auto";},onOpen: function () {fixOuterContainerPopupFiltriRichiesteHeight("multipleSelectStatoRichiesteMobile",0)}});
            $('#multipleSelectMacrocategoriaRichiesteMobile').multipleSelect({filter:true,filterPlaceholder:"Cerca...",locale:"it-IT",maxHeight:1000,onClose: function () {document.getElementById("outerContainerPopupFiltriRichieste").style.height="auto";},onOpen: function () {fixOuterContainerPopupFiltriRichiesteHeight("multipleSelectMacrocategoriaRichiesteMobile",1)}});
            $('#multipleSelectUtenteRichiesteMobile').multipleSelect({filter:true,filterPlaceholder:"Cerca...",locale:"it-IT",maxHeight:1000,onClose: function () {document.getElementById("outerContainerPopupFiltriRichieste").style.height="auto";},onOpen: function () {fixOuterContainerPopupFiltriRichiesteHeight("multipleSelectUtenteRichiesteMobile",2)}});
            document.getElementsByClassName("ms-choice")[0].style.fontFamily="'Quicksand',sans-serif";
            document.getElementsByClassName("ms-choice")[1].style.fontFamily="'Quicksand',sans-serif";
            document.getElementsByClassName("ms-choice")[2].style.fontFamily="'Quicksand',sans-serif";

            try {
                $(".ms-choice div").hide();
            } catch (error) {}
        }
    }).then((result) => 
    {
        if (result.value)
        {
            filterStato=$('#multipleSelectStatoRichiesteMobile').multipleSelect('getSelects');
            filterMacrocategoria=$('#multipleSelectMacrocategoriaRichiesteMobile').multipleSelect('getSelects');
            filterUtente=$('#multipleSelectUtenteRichiesteMobile').multipleSelect('getSelects');

            if(checkboxRicordaFiltriAlProssimoAccesso)
            {
                setCookie("filterStato",filterStato.toString());
                setCookie("filterMacrocategoria",filterMacrocategoria.toString());
                setCookie("filterUtente",filterUtente.toString());
            }
            else
            {
                cleanCookieFiltri();
            }

            reQueryView();
        }
    });
}
function cleanCookieFiltri()
{
    setCookie("filterStato","");
    setCookie("filterMacrocategoria","");
    setCookie("filterUtente","");
}
function fixOuterContainerPopupFiltriRichiesteHeight(id,n)
{
    document.getElementById("outerContainerPopupFiltriRichieste").style.height="auto";
    
    var selectContainerHeight=document.getElementById(id).parentElement.offsetHeight+document.getElementById(id).parentElement.style.marginTop;
    var outerContainerHeight=document.getElementById("outerContainerPopupFiltriRichieste").offsetHeight;
    var selectHeight=document.getElementsByClassName("ms-drop bottom")[n].offsetHeight;

    var totalHeight=((n+1)*selectContainerHeight)+selectHeight;
    if(totalHeight>outerContainerHeight)
    {
        var newHeight=totalHeight+10;
        document.getElementById("outerContainerPopupFiltriRichieste").style.height=newHeight+"px";
    }
}
function getMacrocategorie()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMacrocategorie.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function getUtenti()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getUtentiMail.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
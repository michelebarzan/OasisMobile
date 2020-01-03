var rcDeafaultTop=0;
var tcbExpanded=false;
var view;

var id_richieste=[];
var infoRichieste=[];
var elementsRichieste=[];

window.addEventListener("load", function(event)
{
    //Controlla le impostazioni salvate nei cookie
    checkCookieSettings();

    //Posiziona correttamente il container per le richieste, in base alla configurazione dei controlli
    var tcbHeight=$(".top-control-bar").height();
    rcDeafaultTop=50+10+tcbHeight;
    setRcTop(rcDeafaultTop);

    //Clicca il pulsante tutte le richieste
    document.getElementById('btnTutteLeRichieste').click()

    //Aggiunge il bottone go to top
    addTopButton();
});

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
    }
}
function emptyRichieste()
{
    id_richieste=[];
    infoRichieste=[];
    elementsRichieste=[];

    document.getElementById("richieste-container").innerHTML="";
}
async function getTutteRichieste()
{
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

    //var filtroStato=$('#').multipleSelect('getSelects');
    //var filterMacrocategoria=$('#').multipleSelect('getSelects');
    //var filterUtente=$('#').multipleSelect('getSelects');
    var filterStato=["Chiusa","In attesa di chiusura","Aperta","Presa in carico"];
    var filterMacrocategoria=[1,2,3,4,5,6,7,8];
    //var filterUtente=[1,2,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,32,33,37,38,1039,1040,1041,1043,1044,1045,1046,1048,1049,1052];
    var filterUtente=[1,11,37];

    id_richieste=await getIdRichieste(filterStato,filterMacrocategoria,filterUtente);
    id_richieste.reverse();
    //console.log(id_richieste);

    for (var i = 0; i < id_richieste.length; i++)
    {
        var id_richiesta=id_richieste[i];

        var infoRichiesta=await getInfoRichiesta(id_richiesta);
        //console.log(infoRichiesta);
        var elementRichiesta=getElementRichiesta(infoRichiesta);
        //console.log(elementRichiesta);

        infoRichieste.push(infoRichiesta);
        elementsRichieste.push(elementRichiesta);

        //container.appendChild(elementRichiesta);
        container.insertBefore(elementRichiesta, container.lastChild);
    }
    document.getElementById("spinner-richieste").remove();
    //console.log(infoRichieste);
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
    richiestaOuterContainer.setAttribute("id","richiestaElement"+infoRichiesta['id_richiesta']);
    richiestaOuterContainer.setAttribute("id_richiesta",infoRichiesta['id_richiesta']);
    richiestaOuterContainer.setAttribute("onclick","expandRichiesta("+infoRichiesta['id_richiesta']+")");

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
    userImage.setAttribute("src","user_images/"+infoRichiesta['username_utente_creazione']+".png");
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
async function expandRichiesta(id_richiesta)
{
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
    userImage.setAttribute("src","user_images/"+infoRichiesta['username_utente_creazione']+".png");
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
    btnDettagli.setAttribute("onclick","getDettagliRichiestaPopupDettagli(this,'"+colorStato+"')");
    btnDettagli.setAttribute("style","background-color:"+colorStato+";text-decoration:underline");
    btnDettagli.innerHTML='DETTAGLI<i style="margin-left:5px" class="far fa-info-circle"></i>';
    containerBottoniDettagliRisposte.appendChild(btnDettagli);

    var btnRisposte=document.createElement("button");
    btnRisposte.setAttribute("id","popupDettagliRichiestaBtnRisposte");
    btnRisposte.setAttribute("onclick","getRisposteRichiestaPopupDettagli(this,'"+colorStato+"')");
    btnRisposte.setAttribute("style","background-color:white");
    btnRisposte.innerHTML='RISPOSTE<i style="margin-left:5px" class="fad fa-reply-all"></i>';
    containerBottoniDettagliRisposte.appendChild(btnRisposte);

    outerContainer.appendChild(containerBottoniDettagliRisposte);

    var rowContainer=document.createElement("div");
    rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-dettagli");
    rowContainer.setAttribute("style","flex-direction: column;");

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","font-weight:bold;text-decoration:underline;margin-bottom:5px;");
    simpleTextContainer.innerHTML="Stato";
    rowContainer.appendChild(simpleTextContainer);

    var simpleTextContainer=document.createElement("div");
    simpleTextContainer.setAttribute("class","simple-text-container");
    simpleTextContainer.setAttribute("style","font-weight:bold;text-overflow: ellipsis;color:"+colorStato);
    simpleTextContainer.innerHTML=infoRichiesta["stato"]+'<i class="'+iconStato+'" style="margin-left:5px"></i>';
    rowContainer.appendChild(simpleTextContainer);

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

    var risposte=infoRichiesta["risposte"];
    if(risposte.length==0)
    {
        var rowContainer=document.createElement("div");
        rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-risposte");
        rowContainer.setAttribute("style","flex-direction: column;display:none");
        
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
                var rowContainerBackground="#EBEBEB";

            var rowContainerPaddingTop="5px;";
            if(c==0)
                var rowContainerPaddingTop="0px";
            
            var rowContainerMarginTop="0px;";
            if(c==0)
                var rowContainerMarginTop="10px";
            
            var rowContainer=document.createElement("div");
            rowContainer.setAttribute("class","row-container popup-dettagli-richiesta-element-risposte");
            rowContainer.setAttribute("style","margin-top:"+rowContainerMarginTop+";padding-top:"+rowContainerPaddingTop+";padding-bottom:5px;flex-direction: column;display:none;background-color:"+rowContainerBackground);
            
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

            outerContainer.appendChild(rowContainer);

            c++;
        });
    }

    Swal.fire
    ({
        width:"100%",
        html: outerContainer.outerHTML,
        showCloseButton: true,
        showConfirmButton:false,
        onOpen : function()
                {
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
                }
    }).then((result) => 
    {
        if (result.value)
        {
            
        }
    });
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
function getDettagliRichiestaPopupDettagli(button,colorStato)
{
    button.style.backgroundColor=colorStato;
    button.style.textDecoration="underline";
    document.getElementById("popupDettagliRichiestaBtnRisposte").style.backgroundColor="white";
    document.getElementById("popupDettagliRichiestaBtnRisposte").style.textDecoration="none";

    $(".popup-dettagli-richiesta-element-risposte").hide("fast","swing");

    $(".popup-dettagli-richiesta-element-dettagli").show("fast","swing");
    $(".popup-dettagli-richiesta-element-dettagli").css("display","flex");
}
function getRisposteRichiestaPopupDettagli(button,colorStato)
{
    button.style.backgroundColor=colorStato;
    button.style.textDecoration="underline";
    document.getElementById("popupDettagliRichiestaBtnDettagli").style.backgroundColor="white";
    document.getElementById("popupDettagliRichiestaBtnDettagli").style.textDecoration="none";

    $(".popup-dettagli-richiesta-element-dettagli").hide("fast","swing");

    $(".popup-dettagli-richiesta-element-risposte").show("fast","swing");
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

async function checkCookieSettings()
{
    var coockieCheckboxMostraIdentificativoRichiesta=await getCookie("checkboxMostraIdentificativoRichiesta");
    if(coockieCheckboxMostraIdentificativoRichiesta=="")
        checkboxMostraIdentificativoRichiesta=false;
    if(coockieCheckboxMostraIdentificativoRichiesta.indexOf("true")>-1)
        checkboxMostraIdentificativoRichiesta=true;
    if(coockieCheckboxMostraIdentificativoRichiesta.indexOf("false")>-1)
        checkboxMostraIdentificativoRichiesta=false;
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
    spanMostraIdentificativoRichiesta.innerHTML="Mostra id richieste";
    labelMostraIdentificativoRichiesta.appendChild(spanMostraIdentificativoRichiesta);

    cell1.appendChild(labelMostraIdentificativoRichiesta);

    //------------------------------------------------------------------------------------
    Swal.fire
    ({
        title: 'Impostazioni',
        background: '#363640',
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
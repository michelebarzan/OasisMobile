var rcDeafaultTop=0;
var tcbExpanded=false;

var id_richieste=[];
var infoRichieste=[];
var elementsRichieste=[];

var mostraIdentificativoRichiesta=false;

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
function emptyRichieste()
{
    id_richieste=[];
    infoRichieste=[];
    elementsRichieste=[];

    document.getElementById("richieste-container").innerHTML="";
}
async function getTutteRichieste()
{
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

    if(mostraIdentificativoRichiesta)
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
    usernameContainer.setAttribute("style","font-weight: bold;;white-space: nowrap; text-overflow: ellipsis;");
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
function expandRichiesta(id_richiesta)
{
    var infoRichiesta=getFirstObjByPropValue(infoRichieste,"id_richiesta",id_richiesta);
    Swal.fire
    ({
        text: "Work in progress"
    });
}
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
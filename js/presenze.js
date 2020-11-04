var nomePagina="Presenze";
var pageInfo=
{
    pagina:"presenze.html",
    nomePagina:"Presenze",
    id_pagina:"1048",
    fileName:"presenze"
};
var id_utente;
var today = new Date();

async function onloadpresenze()
{
    id_utente=await getSessionValue("id_utente");
    
    getElencoCalendarioRegistrazioni();
}
async function getElencoCalendarioRegistrazioni()
{
    var container=document.getElementById("containerRegistrazioneOre");
    container.innerHTML="";

    var containerWidth=container.offsetWidth;

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-2x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var calendarioRegistrazioni=await getCalendarioRegistrazioni();

    var giornoWidth=containerWidth/8;
    giornoWidth=giornoWidth-10;
    giornoWidth=giornoWidth+"px";
    
    calendarioRegistrazioni.forEach(giornata =>
    {
        var data=parseDate(giornata.data.date);
        if(document.getElementById("presenzeAnnoContainer"+data.getFullYear())==null)
        {
            var annoTitleContainer=document.createElement("div");
            annoTitleContainer.setAttribute("class","presenze-anno-title-container");
            if(document.getElementsByClassName("presenze-anno-title-container").length>0)
                annoTitleContainer.setAttribute("style","margin-top:20px");
            annoTitleContainer.setAttribute("id","presenzeAnnoContainer"+data.getFullYear());
            var span=document.createElement("span");
            span.innerHTML=data.getFullYear();
            annoTitleContainer.appendChild(span);
            container.appendChild(annoTitleContainer);
        }
        if(document.getElementById("presenzeMeseContainer"+data.getFullYear().toString()+(data.getMonth()+1).toString())==null)
        {
            var meseTitleContainer=document.createElement("div");
            meseTitleContainer.setAttribute("class","presenze-mese-title-container");
            var span=document.createElement("span");
            span.innerHTML=getNomeMese((data.getMonth()+1))+" "+data.getFullYear().toString();
            meseTitleContainer.appendChild(span);
            container.appendChild(meseTitleContainer);

            var meseContainer=document.createElement("div");
            meseContainer.setAttribute("class","presenze-mese-container");
            meseContainer.setAttribute("id","presenzeMeseContainer"+data.getFullYear().toString()+(data.getMonth()+1).toString());
            container.appendChild(meseContainer);
        }

        if(data.getDate()==1)
        {
            var giornoSettimana=data.getDay()-1;

            if(giornoSettimana==-1)
                giornoSettimana=6;
            
            for (let index = 0; index < giornoSettimana; index++)
            {
                var giornoSpace=document.createElement("div");
                giornoSpace.setAttribute("class","presenze-giorno-space");
                giornoSpace.setAttribute("style","width:"+giornoWidth+";min-width:"+giornoWidth+";max-width:"+giornoWidth+"height:"+giornoWidth+";min-height:"+giornoWidth+";max-height:"+giornoWidth);
                document.getElementById("presenzeMeseContainer"+data.getFullYear().toString()+(data.getMonth()+1).toString()).appendChild(giornoSpace);
            }
        }

        var giornoContainer=document.createElement("button");
        giornoContainer.setAttribute("class","presenze-giorno-container");
        if(giornata.registrazioni>0)
            giornoContainer.setAttribute("onclick","getPopupDettagliRegistrazioni('"+giornata.data.date+"')");

        if(data.getFullYear()==today.getFullYear() && (data.getMonth()+1)==(today.getMonth()+1) && data.getDate()==today.getDate())
            giornoContainer.setAttribute("style","box-shadow: 0 0 0 3px #4C91CB;width:"+giornoWidth+";min-width:"+giornoWidth+";max-width:"+giornoWidth+"height:"+giornoWidth+";min-height:"+giornoWidth+";max-height:"+giornoWidth);
        else
            giornoContainer.setAttribute("style","width:"+giornoWidth+";min-width:"+giornoWidth+";max-width:"+giornoWidth+"height:"+giornoWidth+";min-height:"+giornoWidth+";max-height:"+giornoWidth);

        giornoContainer.setAttribute("id","presenzeGiornoContainer"+data.getDate());
        var span=document.createElement("span");
        span.setAttribute("class","presenze-giorno-span");
        span.innerHTML=data.getDate();
        if(giornoSettimana==6 || giornoSettimana==7)
            span.setAttribute("style","color:gray");
        else
            span.setAttribute("style","color:black");
        giornoContainer.appendChild(span);

        if(giornata.registrazioni>0)
        {
            var nRegistrazioniContainer=document.createElement("div");
            if(giornata.chiuse=="true")
                nRegistrazioniContainer.setAttribute("style","background-color:#70B085");
            else
                nRegistrazioniContainer.setAttribute("style","background-color:#DA6969");
            var span=document.createElement("span");
            span.innerHTML=giornata.registrazioni;
            nRegistrazioniContainer.appendChild(span);
            giornoContainer.appendChild(nRegistrazioniContainer);
        }

        document.getElementById("presenzeMeseContainer"+data.getFullYear().toString()+(data.getMonth()+1).toString()).appendChild(giornoContainer);
    });

    var containerHeight=container.offsetHeight;
    var meseOggiHeight=document.getElementById('presenzeMeseContainer'+today.getFullYear().toString()+(today.getMonth()+1).toString()).offsetHeight;
    var toCenterHeight=(containerHeight-meseOggiHeight)/2;

    var meseOggi = document.getElementById('presenzeMeseContainer'+today.getFullYear().toString()+(today.getMonth()+1).toString());
    var topPos = meseOggi.offsetTop-toCenterHeight;
    container.scrollTop = topPos;

    Swal.close();
}
async function getPopupDettagliRegistrazioni(data)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-2x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var dettagliRegistrazioni=await getDettagliRegistrazioni(data);
    if(dettagliRegistrazioni.length==0)
        getElencoCalendarioRegistrazioni();
    else
    {
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","popup-presenze-outer-container");
        outerContainer.setAttribute("style","max-height:350px;overflow-y:auto;margin-bottom:0px");

        dettagliRegistrazioni.forEach(registrazione =>
        {
            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;margin-bottom:10px;border-bottom:1px solid gray;box-sizing:border-box;padding-bottom:5px;min-height:25px");

            var span=document.createElement("span");
            span.setAttribute("style","color:#ddd;font-size: 14px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;");
            span.innerHTML="#"+registrazione.id_registrazione;
            row.appendChild(span);

            var buttonElimina=document.createElement("button");
            buttonElimina.setAttribute("class","popup-presenze-delete-button");
            buttonElimina.setAttribute("onclick","eliminaRegistrazione("+registrazione.id_registrazione+",'"+data+"')");
            buttonElimina.innerHTML='<i class="fad fa-trash"></i>';
            row.appendChild(buttonElimina);

            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
            row.innerHTML="Data inizio";
            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

            var input=document.createElement("input");
            input.setAttribute("type","text");
            input.setAttribute("disabled","disabled");
            input.setAttribute("class","popup-presenze-input");
            input.setAttribute("value",registrazione.dataInizioString);
            
            row.appendChild(input);

            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
            row.innerHTML="Data fine";
            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

            var input=document.createElement("input");
            input.setAttribute("type","text");
            input.setAttribute("disabled","disabled");
            input.setAttribute("class","popup-presenze-input");
            input.setAttribute("value",registrazione.dataFineString);
            
            row.appendChild(input);

            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;margin-bottom:15px;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;margin-top:10px;min-height:15px");
            
            var input=document.createElement("input");
            input.setAttribute("type","checkbox");
            input.setAttribute("disabled","disabled");
            input.setAttribute("id","popupPresenzeSmartWorking"+registrazione.id_registrazione);
            input.setAttribute("style","margin:0px");
            if(registrazione.smartWorking=="true")
                input.setAttribute("checked","checked");
            row.appendChild(input);

            var span=document.createElement("span");
            span.setAttribute("style","color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-left:10px;");
            span.innerHTML="Smart working";
            row.appendChild(span);

            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
            row.innerHTML="Descrizione";
            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

            var textarea=document.createElement("textarea");
            textarea.setAttribute("class","popup-presenze-input");
            textarea.setAttribute("disabled","disabled");
            textarea.setAttribute("id","popupPresenzeDescrizione"+registrazione.id_registrazione);
            textarea.innerHTML=registrazione.descrizione;
            
            row.appendChild(textarea);

            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
            row.innerHTML="Note";
            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("class","popup-foto-ordini-row");
            row.setAttribute("style","width:100%;margin-bottom:15px;justify-content:flex-start");

            var textarea=document.createElement("textarea");
            textarea.setAttribute("class","popup-presenze-input");
            textarea.setAttribute("disabled","disabled");
            textarea.setAttribute("id","popupPresenzeNote"+registrazione.id_registrazione);
            textarea.innerHTML=registrazione.note;
            
            row.appendChild(textarea);

            outerContainer.appendChild(row);
        });

        data=parseDate(data);

        Swal.fire
        ({
            //position:"top",
            width:"100%",
            background:"#404040",
            title:"Registrazioni del "+data.getDate()+"/"+(data.getMonth()+1)+"/"+data.getFullYear(),
            allowOutsideClick:false,
            onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                        document.getElementsByClassName("swal2-title")[0].style.maxWidth="70%";
                        document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                        document.getElementsByClassName("swal2-title")[0].style.marginLeft="10px";
                        document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                        document.getElementsByClassName("swal2-title")[0].style.marginRight="10px";
                        document.getElementsByClassName("swal2-title")[0].style.whiteSpace="nowrap";
                        document.getElementsByClassName("swal2-title")[0].style.overflow="hidden";
                        document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
                        document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                        document.getElementsByClassName("swal2-close")[0].style.outline="none";
                        document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    },
            showCloseButton:true,
            showConfirmButton:false,
            showCancelButton:false,
            html:outerContainer.outerHTML
        }).then((result) =>
        {
            getElencoCalendarioRegistrazioni();
        });
    }
}
function eliminaRegistrazione(id_registrazione,data)
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-2x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    $.get("eliminaRegistrazionePresenze.php",
    {
        id_registrazione
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                getPopupDettagliRegistrazioni(data);
            }
        }
    });
}
function getDettagliRegistrazioni(data)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getDettagliRegistrazioniPresenze.php",
        {
            data,
            id_utente
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
            else
                resolve([]);
        });
    });
}
function getNomeMese(numeroMese)
{
    switch (numeroMese)
    {
        case 1:return "Gennaio";break;
        case 2:return "Febbraio";break;
        case 3:return "Marzo";break;
        case 4:return "Aprile";break;
        case 5:return "Maggio";break;
        case 6:return "Giugno";break;
        case 7:return "Luglio";break;
        case 8:return "Agosto";break;
        case 9:return "Settembre";break;
        case 10:return "Ottobre";break;
        case 11:return "Novembre";break;
        case 12:return "Dicembre";break;
    }
}
function getCalendarioRegistrazioni()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getCalendarioRegistrazioniPresenze.php",
        {
            id_utente
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
            else
                resolve([]);
        });
    });
}
async function getPopupNuovaRegistrazione()
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-2x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var registrazioneAperta=await checkRegistrazioneAperta();
    if(!registrazioneAperta)
    {
        var response=await inserisciNuovaRegistrazione();
        if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
        {
            Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
            console.log(response);
        }
        else
        {
            let timerInterval;
            Swal.fire
            ({
                icon:"success",
                title: "Registrazione aperta",
                background:"#404040",
                showCloseButton:true,
                showConfirmButton:false,
                timer: 2000,
                timerProgressBar: true,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                onClose: () => {clearInterval(timerInterval)}
            }).then((result) =>
            {
                getElencoCalendarioRegistrazioni();
            });
        }
    }
    else
    {
        Swal.fire
        ({
            icon:"warning",
            title: "Devi prima chiudere la registrazione aperta in data "+registrazioneAperta.dataInizioString,
            background:"#404040",
            showCloseButton:true,
            confirmButtonText:"Chiudi registrazione",
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
        }).then((result) =>
        {
            if (result.value)
                getPopupChiudiRegistrazione();
        });
    }
}
function checkRegistrazioneAperta()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("checkRegistrazioneApertaPresenze.php",
        {
            id_utente
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function inserisciNuovaRegistrazione()
{
    return new Promise(function (resolve, reject) 
    {
        $.post("inserisciNuovaRegistrazionePresenze.php",
        {
            id_utente
        },
        function(response, status)
        {
            if(status=="success")
                resolve(response);
        });
    });
}
async function getPopupChiudiRegistrazione()
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-2x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var registrazioneAperta=await checkRegistrazioneAperta();
    if(!registrazioneAperta)
    {
        Swal.fire
        ({
            icon:"warning",
            title: "Hai già chiuso tutte le tue registrazioni",
            background:"#404040",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
        })
    }
    else
    {
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","popup-presenze-outer-container");

        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
        row.innerHTML="Data inizio";
        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;margin-bottom:5px;display:flex;flex-direction:row;align-items:center;justify-content:flex-start");

        /*var input=document.createElement("input");
        input.setAttribute("type","datetime-local");
        input.setAttribute("class","popup-presenze-input");
        input.setAttribute("id","popupPresenzeDataInizio");*/

        var input=document.createElement("input");
        input.setAttribute("type","date");
        input.setAttribute("class","popup-presenze-input");
        input.setAttribute("id","popupPresenzeDataInizio");
        input.setAttribute("style","margin-right:5px");
        input.setAttribute("value",registrazioneAperta.dataInizioInputFormat.split("T")[0]);
        row.appendChild(input);

        var input=document.createElement("input");
        input.setAttribute("type","time");
        input.setAttribute("class","popup-presenze-input");
        input.setAttribute("id","popupPresenzeOraInizio");
        input.setAttribute("style","margin-left:5px");
        input.setAttribute("value",registrazioneAperta.dataInizioInputFormat.split("T")[1]);
        row.appendChild(input);

        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
        row.innerHTML="Data fine";
        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;margin-bottom:5px;display:flex;flex-direction:row;align-items:center;justify-content:flex-start");

        /*var input=document.createElement("input");
        input.setAttribute("type","datetime-local");
        input.setAttribute("class","popup-presenze-input");
        input.setAttribute("id","popupPresenzeDataFine");*/

        var month=(today.getMonth()+1).toString();
        if(month.length==1)
            month="0"+month;
        var day=today.getDate().toString();
        if(day.length==1)
            day="0"+day;
        var hours=today.getHours().toString();
        if(hours.length==1)
            hours="0"+hours;
        var minutes=today.getMinutes().toString();
        if(minutes.length==1)
            minutes="0"+minutes;
        var datetime = today.getFullYear() + "-" + month +"-" + day +"T" + hours + ":"  + minutes;

        var input=document.createElement("input");
        input.setAttribute("type","date");
        input.setAttribute("class","popup-presenze-input");
        input.setAttribute("id","popupPresenzeDataFine");
        input.setAttribute("style","margin-right:5px");
        input.setAttribute("value",today.getFullYear() + "-" + month +"-" + day);
        row.appendChild(input);

        var input=document.createElement("input");
        input.setAttribute("type","time");
        input.setAttribute("class","popup-presenze-input");
        input.setAttribute("id","popupPresenzeOraFine");
        input.setAttribute("style","margin-left:5px");
        input.setAttribute("value",hours + ":"  + minutes);
        row.appendChild(input);
        
        row.appendChild(input);

        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;margin-bottom:15px;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;margin-top:10px");
        
        var input=document.createElement("input");
        input.setAttribute("type","checkbox");
        input.setAttribute("id","popupPresenzeSmartWorking");
        input.setAttribute("style","margin:0px");
        input.setAttribute("checked","checked");
        row.appendChild(input);

        var span=document.createElement("span");
        span.setAttribute("style","color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-left:10px;");
        span.innerHTML="Smart working";
        row.appendChild(span);

        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
        row.innerHTML="Descrizione";
        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

        var textarea=document.createElement("textarea");
        textarea.setAttribute("class","popup-presenze-input");
        textarea.setAttribute("id","popupPresenzeDescrizione");
        
        row.appendChild(textarea);

        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
        row.innerHTML="Note";
        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-foto-ordini-row");
        row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

        var textarea=document.createElement("textarea");
        textarea.setAttribute("class","popup-presenze-input");
        textarea.setAttribute("id","popupPresenzeNote");
        
        row.appendChild(textarea);

        outerContainer.appendChild(row);
        
        var row=document.createElement("div");
        row.setAttribute("class","popup-presenze-row");
        row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

        var confirmButton=document.createElement("button");
        confirmButton.setAttribute("class","popup-presenze-button");
        confirmButton.setAttribute("style","width:100%;");
        confirmButton.setAttribute("onclick","chiudiRegistrazione("+registrazioneAperta.id_registrazione+")");
        confirmButton.innerHTML='<span>Conferma</span><i class="fal fa-check-circle"></i>';
        row.appendChild(confirmButton);    

        outerContainer.appendChild(row);

        Swal.fire
        ({
            //position:"top",
            width:"100%",
            background:"#404040",
            title:"Chiudi registrazione",
            allowOutsideClick:false,
            onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                        document.getElementsByClassName("swal2-title")[0].style.maxWidth="70%";
                        document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                        document.getElementsByClassName("swal2-title")[0].style.marginLeft="10px";
                        document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                        document.getElementsByClassName("swal2-title")[0].style.marginRight="10px";
                        document.getElementsByClassName("swal2-title")[0].style.whiteSpace="nowrap";
                        document.getElementsByClassName("swal2-title")[0].style.overflow="hidden";
                        document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
                        document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                        document.getElementsByClassName("swal2-close")[0].style.outline="none";
                        document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    },
            showCloseButton:true,
            showConfirmButton:false,
            showCancelButton:false,
            html:outerContainer.outerHTML
        });
    }
}
function chiudiRegistrazione(id_registrazione)
{
    var dataInizio=document.getElementById("popupPresenzeDataInizio").value+" "+document.getElementById("popupPresenzeOraInizio").value;
    var dataFine=document.getElementById("popupPresenzeDataFine").value+" "+document.getElementById("popupPresenzeOraFine").value;
    var smartWorking=document.getElementById("popupPresenzeSmartWorking").checked;
    var descrizione=document.getElementById("popupPresenzeDescrizione").value;
    var note=document.getElementById("popupPresenzeNote").value;

    if(dataInizio=="" || dataFine=="")
    {
        Swal.fire
        ({
            icon:"error",
            width:"100%",
            background:"#404040",
            title:"Compila data inizio e data fine",
            allowOutsideClick:true,
            onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                        document.getElementsByClassName("swal2-close")[0].style.outline="none";
                        document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    },
            showCloseButton:true,
            showConfirmButton:false,
            showCancelButton:false
        }).then((result) =>
        {
            getPopupChiudiRegistrazione();
        });
    }
    else
    {
        if(parseDate(dataInizio).getDate() != parseDate(dataFine).getDate())
        {
            Swal.fire
            ({
                icon:"error",
                width:"100%",
                background:"#404040",
                title:"I giorni di inizio e fine registrazione devono coincidere",
                allowOutsideClick:true,
                onOpen : function()
                        {
                            document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                            document.getElementsByClassName("swal2-close")[0].style.outline="none";
                            document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                        },
                showCloseButton:true,
                showConfirmButton:false,
                showCancelButton:false
            }).then((result) =>
            {
                getPopupChiudiRegistrazione();
            });
        }
        else
        {
            dataInizio=parseDate(dataInizio);
            var year=dataInizio.getFullYear().toString();
            var month=(dataInizio.getMonth()+1).toString();
            if(month.length==1)
                month="0"+month;
            var day=dataInizio.getDate().toString();
            if(day.length==1)
                day="0"+day;
            var hours=dataInizio.getHours().toString();
            if(hours.length==1)
                hours="0"+hours;
            var minutes=dataInizio.getMinutes().toString();
            if(minutes.length==1)
                minutes="0"+minutes;
            var seconds=dataInizio.getSeconds().toString();
            if(seconds.length==1)
                seconds="0"+seconds;
            dataInizio=year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + ".000";
            
            dataFine=parseDate(dataFine);
            var year=dataFine.getFullYear().toString();
            var month=(dataFine.getMonth()+1).toString();
            if(month.length==1)
                month="0"+month;
            var day=dataFine.getDate().toString();
            if(day.length==1)
                day="0"+day;
            var hours=dataFine.getHours().toString();
            if(hours.length==1)
                hours="0"+hours;
            var minutes=dataFine.getMinutes().toString();
            if(minutes.length==1)
                minutes="0"+minutes;
            var seconds=dataFine.getSeconds().toString();
            if(seconds.length==1)
                seconds="0"+seconds;
            dataFine=year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + ".000";
    
            Swal.fire
            ({
                width:"100%",
                background:"transparent",
                title:"Caricamento in corso...",
                html:'<i class="fad fa-spinner-third fa-spin fa-2x" style="color:white"></i>',
                allowOutsideClick:false,
                showCloseButton:false,
                showConfirmButton:false,
                showCancelButton:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";}
            });
    
            $.post("chiudiRegistrazionePresenze.php",
            {
                id_registrazione,
                dataInizio,
                dataFine,
                smartWorking,
                descrizione,
                note
            },
            function(response, status)
            {
                if(status=="success")
                {
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                    }
                    else
                    {
                        let timerInterval;
                        Swal.fire
                        ({
                            icon:"success",
                            title: "Registrazione chiusa",
                            background:"#404040",
                            showCloseButton:true,
                            showConfirmButton:false,
                            timer: 2000,
                            timerProgressBar: true,
                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                            onClose: () => {clearInterval(timerInterval)}
                        }).then((result) =>
                        {
                            getElencoCalendarioRegistrazioni();
                        });
                    }
                }
            });
        }
    }
}
function parseDate(data)
{
    if(isIos())
    {
        return new Date(data.replace(' ', 'T'));
    }
    else
    {
        return new Date(data);
    }
}
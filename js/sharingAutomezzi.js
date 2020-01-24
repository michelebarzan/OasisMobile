var nomePagina="Automezzi";
var id_prenotazione;
var prenotazioniAperte=[];
var id_utente;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var hh=today.getHours();
var ii=today.getMinutes();
if(today.getHours()<10)
    hh= "0" + hh;
if(today.getMinutes()<10)
    ii= "0" + ii;

var now =  hh + ":" + ii;
today = yyyy + '-' + mm + '-' + dd;

window.addEventListener("load", async function(event)
{
    id_utente=await getSessionValue("id_utente");
    getElencoPrenotazioniAutomezzi(id_utente);
    var checkPrenotazioneAutomezzoApertaResponse=await checkPrenotazioneAutomezzoAperta(id_utente);
    if(checkPrenotazioneAutomezzoApertaResponse!="")
    {
        id_prenotazione=checkPrenotazioneAutomezzoApertaResponse;
        getPopupConsegnaVeicolo();
    }
    else
        getPopupPrenotazioneVeicolo();

    //Aggiunge il bottone go to top
    addTopButton();
});
async function getElencoPrenotazioniAutomezzi(id_utente)
{
    var container=document.getElementById("containerPrenotazioniAutomezzi");
    container.innerHTML="";

    var prenotazioniAutomezzi=await getPrenotazioniAutomezzi(id_utente);
    prenotazioniAutomezzi.forEach(function (prenotazione)
    {
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","outer-container-prenotazione-automezzi");

        var row=document.createElement("div");
        row.setAttribute("style","flex-direction:row;display:flex;width:100%");

        var infoContainer=document.createElement("div");
        infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
        infoContainer.setAttribute("style","color:rgb(48, 133, 214);font-size:15px;font-weight:bold;border-radius:50%;background-color:#f0f0f0;line-height:35px;height:40px;width:40px;text-align:center;border:3px solid #EBEBEB");
        infoContainer.innerHTML="#"+prenotazione.id_prenotazione;
        row.appendChild(infoContainer);

        var rowContainer=document.createElement("div");
        rowContainer.setAttribute("style","display:flex;flex-direction:column;width:calc(100% - 40px);height:38px;justify-content: space-around;");

        var innerRow=document.createElement("div");
        innerRow.setAttribute("style","display:flex;flex-direction:row;width:100%;justify-content: space-between;");

        var infoContainer=document.createElement("div");
        infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
        infoContainer.setAttribute("style","padding-left:10px;padding-right:10px;");
        infoContainer.innerHTML=prenotazione.username;
        innerRow.appendChild(infoContainer);

        var infoContainer=document.createElement("div");
        infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
        infoContainer.setAttribute("style","padding-left:10px;padding-right:10px;color:gray;text-align:right;");
        infoContainer.innerHTML=prenotazione.data_prenotazione;
        innerRow.appendChild(infoContainer);

        rowContainer.appendChild(innerRow);
        row.appendChild(rowContainer);

        var innerRow=document.createElement("div");
        innerRow.setAttribute("style","display:flex;flex-direction:row;width:100%;justify-content: space-between;");

        var infoContainer=document.createElement("div");
        infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
        infoContainer.setAttribute("style","padding-left:10px;padding-right:10px;");
        infoContainer.innerHTML=prenotazione.marca + " " + prenotazione.modello + " (" + prenotazione.targa + ")";
        innerRow.appendChild(infoContainer);

        rowContainer.appendChild(innerRow);
        row.appendChild(rowContainer);

        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("style","flex-direction:column;display:flex;width:100%;margin-top:10px");

        var infoContainer=document.createElement("div");
        infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
        infoContainer.setAttribute("style","font-weight:bold;text-decoration:underline");
        infoContainer.innerHTML="Destinazioni";
        row.appendChild(infoContainer);
        
        var innerRow=document.createElement("div");
        innerRow.setAttribute("style","width:100%;");

        var ul=document.createElement("ul");
        ul.setAttribute("class","list-prenotazione-automezzi");

        prenotazione.destinazioni.forEach(function(indirizzo)
        {
            var li=document.createElement("li");
            var infoContainer=document.createElement("div");
            infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
            infoContainer.innerHTML=indirizzo;
            li.appendChild(infoContainer);
            ul.appendChild(li);
        });
        innerRow.appendChild(ul);

        row.appendChild(innerRow);

        outerContainer.appendChild(row);

        if(prenotazione.stato=="close")
        {
            if(prenotazione.note!=="")
            {
                var row=document.createElement("div");
                row.setAttribute("style","flex-direction:column;display:flex;width:100%;margin-top:10px");

                var infoContainer=document.createElement("div");
                infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
                infoContainer.setAttribute("style","font-weight:bold;text-decoration:underline");
                infoContainer.innerHTML="Note";
                row.appendChild(infoContainer);

                var infoContainer=document.createElement("div");
                infoContainer.setAttribute("class","info-container-prenotazione-automezzi");
                infoContainer.setAttribute("style","margin-top:5px;");
                infoContainer.innerHTML=prenotazione.note;
                row.appendChild(infoContainer);

                outerContainer.appendChild(row);
            }

            var row=document.createElement("div");
            row.setAttribute("style","flex-direction:column;display:flex;width:100%;margin-top:10px");

            var infoContainer=document.createElement("div");
            infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
            infoContainer.setAttribute("style","font-weight:bold;text-decoration:underline");
            infoContainer.innerHTML="KM veicolo";
            row.appendChild(infoContainer);

            var infoContainer=document.createElement("div");
            infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
            infoContainer.setAttribute("style","margin-top:5px");
            infoContainer.innerHTML=prenotazione.km_consegna;
            row.appendChild(infoContainer);

            outerContainer.appendChild(row);

            var row=document.createElement("div");
            row.setAttribute("style","flex-direction:column;display:flex;width:100%;margin-top:10px");

            var infoContainer=document.createElement("div");
            infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
            infoContainer.setAttribute("style","font-weight:bold;text-decoration:underline");
            infoContainer.innerHTML="Consegna";
            row.appendChild(infoContainer);

            var infoContainer=document.createElement("div");
            infoContainer.setAttribute("class","sr-info-container-prenotazione-automezzi");
            infoContainer.setAttribute("style","margin-top:5px");
            infoContainer.innerHTML=prenotazione.data_consegna;
            row.appendChild(infoContainer);

            outerContainer.appendChild(row);
        }
        else
        {
            var row=document.createElement("div");
            row.setAttribute("style","width:100%;margin-top:10px");

            var buttonConsegnaAutomezzo=document.createElement("button");
            buttonConsegnaAutomezzo.setAttribute("class","button-consegna-automezzo-prenotazione-automezzi");
            buttonConsegnaAutomezzo.setAttribute("onclick","id_prenotazione="+prenotazione.id_prenotazione+";getPopupConsegnaVeicolo();");
            buttonConsegnaAutomezzo.innerHTML='Consegna veicolo <i style="margin-left:5px" class="fas fa-clipboard-check" ></i>';
            row.appendChild(buttonConsegnaAutomezzo);

            outerContainer.appendChild(row);
        }

        container.appendChild(outerContainer);
    });
}
function getPrenotazioniAutomezzi(id_utente)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getPrenotazioniAutomezzi.php",
        {
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
function getPrenotazioniAperte(id_utente)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getPrenotazioniAperte.php",
        {
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
function checkPrenotazioneAutomezzoAperta(id_utente)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("checkPrenotazioneAutomezzoAperta.php",
        {
            id_utente
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
async function getPopupPrenotazioneVeicolo()
{
    var outerContainer1=document.createElement("div");
    outerContainer1.setAttribute("id","popupNuovaPrenotazioneVeicoloOuterContainer1");
    outerContainer1.setAttribute("class","popupNuovaPrenotazioneVeicoloOuterContainer");

    //VEICOLO--------------------------------------------------------------------------------

    var inputContainer=document.createElement("div");
    inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

    var formInputLabel=document.createElement("div");
    formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
    formInputLabel.innerHTML="Veicolo";

    inputContainer.appendChild(formInputLabel);

    var formInput=document.createElement("select");
    formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloSelect");
    formInput.setAttribute("onchange","checkNuovoAutomezzo(this)");
    formInput.setAttribute("id","veicolo");

    var automezzi=await getAnagraficaAutomezzi();
    automezzi.forEach(function(automezzo)
    {
        var option=document.createElement("option");
        option.setAttribute("value",automezzo.id_automezzo);
        option.innerHTML=automezzo.marca + " " + automezzo.modello + " (" + automezzo.targa + ")";
        formInput.appendChild(option);
    });
    var option=document.createElement("option");
    option.setAttribute("value","new");
    option.innerHTML="Aggiungi veicolo...";
    formInput.appendChild(option);

    inputContainer.appendChild(formInput);

    outerContainer1.appendChild(inputContainer);

    //---------------------------------------------------------------------------------------

    //UTENTE PRENOTAZIONE--------------------------------------------------------------------------------

    var inputContainer=document.createElement("div");
    inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

    var formInputLabel=document.createElement("div");
    formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
    formInputLabel.innerHTML="Utente";

    inputContainer.appendChild(formInputLabel);

    var formInput=document.createElement("select");
    formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloSelect");
    formInput.setAttribute("id","utente_prenotazione");

    var id_utente=await getSessionValue("id_utente");
    var username=await getSessionValue("username");
    var option=document.createElement("option");
    option.setAttribute("value",id_utente);
    option.innerHTML=username;
    formInput.appendChild(option);

    var utenti=await getUtenti();
    utenti.forEach(function(utente)
    {
        if(utente.value != id_utente)
        {
            var option=document.createElement("option");
            option.setAttribute("value",utente.value);
            option.innerHTML=utente.label;
            formInput.appendChild(option);
        }
    });

    inputContainer.appendChild(formInput);

    outerContainer1.appendChild(inputContainer);

    //---------------------------------------------------------------------------------------

    //DATA ORA PARTENZA----------------------------------------------------------------------------

    var inputContainer=document.createElement("div");
    inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

    var formInputLabel=document.createElement("div");
    formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
    formInputLabel.innerHTML="Partenza";

    inputContainer.appendChild(formInputLabel);

    var inputInnerContainer=document.createElement("div");
    inputInnerContainer.setAttribute("style","display:flex;flex-direction:row;width:100%");

    var formInput=document.createElement("input");
    formInput.setAttribute("type","date");
    formInput.setAttribute("style","width:65%");
    formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput");

    formInput.setAttribute("value",today);
    formInput.setAttribute("id","data_prenotazione");

    inputInnerContainer.appendChild(formInput);

    var formInput=document.createElement("input");
    formInput.setAttribute("type","time");
    formInput.setAttribute("style","width:35%;margin-left:5px");
    formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput");

    formInput.setAttribute("value",now);
    formInput.setAttribute("id","ora_prenotazione");

    inputInnerContainer.appendChild(formInput);

    inputContainer.appendChild(inputInnerContainer);

    outerContainer1.appendChild(inputContainer);
    
    //---------------------------------------------------------------------------------------

    //DESTINAZIONI--------------------------------------------------------------------------------

    var inputContainer=document.createElement("div");
    inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");
    inputContainer.setAttribute("id","containerDestinazioni");
    inputContainer.setAttribute("style","margin-bottom:-10px");

    var formInputLabel=document.createElement("div");
    formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
    formInputLabel.innerHTML="Destinazioni";

    inputContainer.appendChild(formInputLabel);

    var inputInnerContainer=document.createElement("div");
    inputInnerContainer.setAttribute("style","display:flex;flex-direction:row;width:100%;margin-bottom:10px");

    var formInput=document.createElement("textarea");
    formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput textareaDestinazione");
    formInput.setAttribute("style","width:65%");
    formInput.setAttribute("id","destinazione1");
    inputInnerContainer.appendChild(formInput);

    var buttonAggiungiIndirizzo=document.createElement("button");
    buttonAggiungiIndirizzo.setAttribute("class","button-aggiungi-indirizzo");
    buttonAggiungiIndirizzo.innerHTML='Aggiungi <i style="margin-left:5px" class="fas fa-map-marker-alt"></i>';
    buttonAggiungiIndirizzo.setAttribute("onclick","aggiungiDestinazione(this)");
    inputInnerContainer.appendChild(buttonAggiungiIndirizzo);

    inputContainer.appendChild(inputInnerContainer);

    outerContainer1.appendChild(inputContainer);

    //---------------------------------------------------------------------------------------

    Swal.fire
    ({
        title:"Prenotazione veicolo",
        width:"100%",
        html: outerContainer1.outerHTML,
        //position:"top",
        showCloseButton: true,
        showConfirmButton:true,
        confirmButtonText: "Prenota",
        allowOutsideClick:false,
        onOpen : function()
                {
                    document.getElementById("swal2-title").style.fontSize="18px";
                    document.getElementsByClassName("swal2-confirm")[0].style.width="calc(100% - 30px)";
                    document.getElementsByClassName("swal2-confirm")[0].style.borderRadius="3px";
                    document.getElementsByClassName("swal2-confirm")[0].style.backgroundColor="rgb(48, 133, 214";
                    document.getElementsByClassName("swal2-confirm")[0].style.boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";
                }
    }).then((result) => 
    {
        if (result.value)
        {
            var veicolo=document.getElementById("veicolo").value;
            var utente=document.getElementById("utente_prenotazione").value;
            var data_prenotazione=document.getElementById("data_prenotazione").value;
            var ora_prenotazione=document.getElementById("ora_prenotazione").value;
            var destinazioni=[];
            var inputDestinazioni=document.getElementsByClassName("textareaDestinazione");
            for (let index = 0; index < inputDestinazioni.length; index++)
            {
                const inputDestinazione = inputDestinazioni[index];
                if(inputDestinazione.value!="" && inputDestinazione.value!=null && inputDestinazione.value!=undefined)
                {
                    destinazioni.push(inputDestinazione.value);
                }
            }
            if(destinazioni.length==0 || veicolo=="" || utente=="" || data_prenotazione=="" || ora_prenotazione=="")
            {
                Swal.fire
                ({
                    icon:"error",
                    title: "Compila tutti i campi",
                    onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                }).then((result) => 
                {
                    getPopupPrenotazioneVeicolo();
                });
            }
            else
            {
                JSONdestinazioni=JSON.stringify(destinazioni);
                $.post("inserisciPrenotazioneAutomezzo.php",
                {
                    veicolo,
                    utente,
                    data_prenotazione,
                    ora_prenotazione,
                    JSONdestinazioni,
                    id_utente
                },
                function(response, status)
                {
                    console.log(response)
                    if(status=="success")
                    {
                        if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                        {
                            Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        }
                        else
                        {
                            id_prenotazione=response;
                            getElencoPrenotazioniAutomezzi(id_utente);
                            Swal.fire
                            ({
                                icon:"success",
                                title: 'Veicolo prenotato',
                                timer: 2000,
                                showConfirmButton:false,
                                timerProgressBar: true,
                                onBeforeOpen: () => 
                                {
                                    document.getElementsByClassName("swal2-title")[0].style.color="gray";
                                    document.getElementsByClassName("swal2-title")[0].style.fontSize="18px";
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
function getInfoPrenotazione(colonna,tipo,id_prenotazione)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getInfoPrenotazione.php",
        {
            colonna,
            tipo,
            id_prenotazione
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
function getUsernameById(id_utente)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getUsernameById.php",
        {
            id_utente
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
function getInfoVeicolo(colonna,id_veicolo)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getInfoVeicolo.php",
        {
            colonna,
            id_veicolo
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
function getNewIdPrenotazione(which)
{
    var index=prenotazioniAperte.indexOf(parseInt(id_prenotazione));
    if(which=="left")
        index--;
    if(which=="right")
        index++;
    
    var new_id_prenotazione=prenotazioniAperte[index];
    if(new_id_prenotazione!=undefined)
    {
        id_prenotazione=new_id_prenotazione;
        getPopupConsegnaVeicolo();
    }
}
async function getPopupConsegnaVeicolo()
{
    prenotazioniAperte=await getPrenotazioniAperte(id_utente);
    prenotazioniAperte.sort();
    if(id_prenotazione==undefined && prenotazioniAperte.length==0)
    {
        Swal.fire({icon:"success",title: "Tutti i veicoli sono stati consegnati",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
    }
    else
    {
        if(id_prenotazione==undefined)
            id_prenotazione=Math.max.apply(null, prenotazioniAperte);
        
        if(id_prenotazione!=undefined)
        {
            var outerContainer2=document.createElement("div");
            outerContainer2.setAttribute("class","popupNuovaPrenotazioneVeicoloOuterContainer");
            outerContainer2.setAttribute("id","popupNuovaPrenotazioneVeicoloOuterContainer2");

            if(prenotazioniAperte.length>0)
            {
                var inputContainer=document.createElement("div");
                inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");
                inputContainer.setAttribute("style","background-color:#ddd;margin-top:10px;margin-bottom:10px;display:flex;flex-direction:row");

                var switchPrenotazioneButton=document.createElement("button");
                switchPrenotazioneButton.setAttribute("class","switchPrenotazioneButton");
                switchPrenotazioneButton.setAttribute("onclick","getNewIdPrenotazione('left')");
                switchPrenotazioneButton.innerHTML='<i class="fas fa-caret-left"></i>';
                inputContainer.appendChild(switchPrenotazioneButton);

                var formInputLabel=document.createElement("div");
                formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
                formInputLabel.setAttribute("style","width:calc(100%-60px);text-align:center;text-decoration:none;font-size:15px;height:30px;line-height:30px");
                formInputLabel.innerHTML="Prenotazione <b style='color:rgb(48, 133, 214)'>#"+id_prenotazione+"</b>";
                inputContainer.appendChild(formInputLabel);

                var switchPrenotazioneButton=document.createElement("button");
                switchPrenotazioneButton.setAttribute("class","switchPrenotazioneButton");
                switchPrenotazioneButton.setAttribute("onclick","getNewIdPrenotazione('right')");
                switchPrenotazioneButton.innerHTML='<i class="fas fa-caret-right"></i>';
                inputContainer.appendChild(switchPrenotazioneButton);
                
                outerContainer2.appendChild(inputContainer);
            }

            //UTENTE E DATA PRENOTAZIONE--------------------------------------------------------------------------------

            var data_prenotazione=await getInfoPrenotazione("data_prenotazione","data",id_prenotazione);
            var id_utente_prenotazione=await getInfoPrenotazione("utente_prenotazione","",id_prenotazione);
            var username_utente_prenotazione=await getUsernameById(id_utente_prenotazione);

            var inputContainer=document.createElement("div");
            inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer infoPrenotazioneContainer");

            var formInputLabel=document.createElement("div");
            formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
            formInputLabel.setAttribute("style","width:50%;");

            formInputLabel.innerHTML=username_utente_prenotazione;

            inputContainer.appendChild(formInputLabel);

            var formInputLabel=document.createElement("div");
            formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
            formInputLabel.setAttribute("style","width:50%;font-weight:normal;text-decoration:none;color:gray;text-align:right");

            formInputLabel.innerHTML=data_prenotazione;

            inputContainer.appendChild(formInputLabel);

            outerContainer2.appendChild(inputContainer);

            //---------------------------------------------------------------------------------------

            //VEICOLO--------------------------------------------------------------------------------

            var id_veicolo=await getInfoPrenotazione("veicolo","",id_prenotazione);
            var marca=await getInfoVeicolo("marca",id_veicolo);
            var modello=await getInfoVeicolo("modello",id_veicolo);
            var targa=await getInfoVeicolo("targa",id_veicolo);

            var inputContainer=document.createElement("div");
            inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

            var formInputLabel=document.createElement("div");
            formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
            formInputLabel.innerHTML=marca + " " + modello + " ("+targa+")";

            inputContainer.appendChild(formInputLabel);
            
            outerContainer2.appendChild(inputContainer);

            //---------------------------------------------------------------------------------------

            //NOTE--------------------------------------------------------------------------------

            var inputContainer=document.createElement("div");
            inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

            var formInputLabel=document.createElement("div");
            formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
            formInputLabel.innerHTML="Note";

            inputContainer.appendChild(formInputLabel);

            var formInput=document.createElement("textarea");
            formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput");
            formInput.setAttribute("id","note");
            inputContainer.appendChild(formInput);

            outerContainer2.appendChild(inputContainer);

            //---------------------------------------------------------------------------------------

            //KM--------------------------------------------------------------------------------

            var inputContainer=document.createElement("div");
            inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

            var formInputLabel=document.createElement("div");
            formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
            formInputLabel.innerHTML="KM veicolo";

            inputContainer.appendChild(formInputLabel);

            var formInput=document.createElement("textarea");
            formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput");
            formInput.setAttribute("id","km_consegna");
            inputContainer.appendChild(formInput);

            outerContainer2.appendChild(inputContainer);

            //---------------------------------------------------------------------------------------

            //DATA ORA CONSEGNA----------------------------------------------------------------------------

            var inputContainer=document.createElement("div");
            inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

            var formInputLabel=document.createElement("div");
            formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
            formInputLabel.innerHTML="Consegna";

            inputContainer.appendChild(formInputLabel);

            var inputInnerContainer=document.createElement("div");
            inputInnerContainer.setAttribute("style","display:flex;flex-direction:row;width:100%");

            var formInput=document.createElement("input");
            formInput.setAttribute("type","date");
            formInput.setAttribute("style","width:65%");
            formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput");

            formInput.setAttribute("value",today);
            formInput.setAttribute("id","data_consegna");

            inputInnerContainer.appendChild(formInput);

            var formInput=document.createElement("input");
            formInput.setAttribute("type","time");
            formInput.setAttribute("style","width:35%;margin-left:5px");
            formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput");

            formInput.setAttribute("value",now);
            formInput.setAttribute("id","ora_consegna");

            inputInnerContainer.appendChild(formInput);

            inputContainer.appendChild(inputInnerContainer);

            outerContainer2.appendChild(inputContainer);

            Swal.fire
            ({
                title:"Consegna veicolo",
                width:"100%",
                html: outerContainer2.outerHTML,
                //position:"top",
                showCloseButton: true,
                showConfirmButton:true,
                confirmButtonText: "Consegna",
                allowOutsideClick:false,
                onOpen : function()
                        {
                            document.getElementById("swal2-title").style.fontSize="18px";
                            document.getElementsByClassName("swal2-confirm")[0].style.width="calc(100% - 30px)";
                            document.getElementsByClassName("swal2-confirm")[0].style.borderRadius="3px";
                            document.getElementsByClassName("swal2-confirm")[0].style.backgroundColor="rgb(48, 133, 214";
                            document.getElementsByClassName("swal2-confirm")[0].style.boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";
                            try {
                                initResizeTextarea();
                            } catch (error) {}
                        }
            }).then((result) => 
            {
                if (result.value)
                {
                    var note=document.getElementById("note").value;
                    var km_consegna=document.getElementById("km_consegna").value;
                    var data_consegna=document.getElementById("data_consegna").value;
                    var ora_consegna=document.getElementById("ora_consegna").value;

                    if(km_consegna=="" || data_consegna=="" || ora_consegna=="")
                    {
                        Swal.fire
                        ({
                            icon:"error",
                            title: "Compila i campi KM veicolo e Arrivo",
                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                        }).then((result) => 
                        {
                            getPopupConsegnaVeicolo();
                        });
                    }
                    else
                    {
                        $.post("completaPrenotazioneAutomezzo.php",
                        {
                            note,
                            km_consegna,
                            id_prenotazione,
                            data_consegna,
                            ora_consegna,
                            id_utente
                        },
                        function(response, status)
                        {
                            if(status=="success")
                            {
                                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                                {
                                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                                }
                                else
                                {
                                    id_prenotazione=response;

                                    getElencoPrenotazioniAutomezzi(id_utente);

                                    Swal.fire
                                    ({
                                        icon:"success",
                                        title: 'Veicolo consegnato',
                                        timer: 2000,
                                        showConfirmButton:false,
                                        timerProgressBar: true,
                                        onBeforeOpen: () => 
                                        {
                                            document.getElementsByClassName("swal2-title")[0].style.color="gray";
                                            document.getElementsByClassName("swal2-title")[0].style.fontSize="18px";
                                        }
                                    });
                                }
                            }
                            else
                                reject({status});
                        });
                    }
                }
            });
        }
    }
}
function aggiungiDestinazione(button)
{
    var idInputDestinazioni=[];
    var inputDestinazioni=document.getElementsByClassName("textareaDestinazione");
    for (let index = 0; index < inputDestinazioni.length; index++)
    {
        const inputDestinazione = inputDestinazioni[index];
        var idInputDestinazione = inputDestinazione.id.replace("destinazione","");
        idInputDestinazioni.push(parseInt(idInputDestinazione));
    }
    var nIndirizzo=Math.max.apply(null, idInputDestinazioni);
    if(document.getElementById("destinazione"+nIndirizzo).value!="")
    {
        button.innerHTML='Rimuovi <i style="margin-left:5px" class="far fa-times"></i>';
        button.style.backgroundColor="rgb(218, 105, 105)";
        button.setAttribute("onclick","rimuoviDestinazione(this)");

        document.getElementById("destinazione"+nIndirizzo).disabled=true;

        var inputInnerContainer=document.createElement("div");
        inputInnerContainer.setAttribute("style","display:flex;flex-direction:row;width:100%;margin-bottom:10px");

        var formInput=document.createElement("textarea");
        formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput textareaDestinazione");
        formInput.setAttribute("style","width:65%");
        formInput.setAttribute("id","destinazione"+(nIndirizzo+1));
        inputInnerContainer.appendChild(formInput);

        var buttonAggiungiIndirizzo=document.createElement("button");
        buttonAggiungiIndirizzo.setAttribute("class","button-aggiungi-indirizzo");
        buttonAggiungiIndirizzo.innerHTML='Aggiungi <i style="margin-left:5px" class="fas fa-map-marker-alt"></i>';
        buttonAggiungiIndirizzo.setAttribute("onclick","aggiungiDestinazione(this)");
        inputInnerContainer.appendChild(buttonAggiungiIndirizzo);

        document.getElementById("containerDestinazioni").appendChild(inputInnerContainer);

    }
}
function rimuoviDestinazione(button)
{
    button.parentElement.remove();
}
function getUtenti()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getUtenti.php",
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
function getAnagraficaAutomezzi()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getAnagraficaAutomezzi.php",
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
function checkNuovoAutomezzo(select)
{
    var value=select.value;
    if(value=="new")
    {
        var outerContainer1=document.createElement("div");
        outerContainer1.setAttribute("class","popupNuovaPrenotazioneVeicoloOuterContainer");

        //MARCA--------------------------------------------------------------------------------

        var inputContainer=document.createElement("div");
        inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

        var formInputLabel=document.createElement("div");
        formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
        formInputLabel.innerHTML="Marca";

        inputContainer.appendChild(formInputLabel);

        var formInput=document.createElement("textarea");
        formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput");
        formInput.setAttribute("id","marca");

        inputContainer.appendChild(formInput);

        outerContainer1.appendChild(inputContainer);

        //---------------------------------------------------------------------------------------

        //MODELLO--------------------------------------------------------------------------------

        var inputContainer=document.createElement("div");
        inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

        var formInputLabel=document.createElement("div");
        formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
        formInputLabel.innerHTML="Modello";

        inputContainer.appendChild(formInputLabel);

        var formInput=document.createElement("textarea");
        formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput");
        formInput.setAttribute("id","modello");

        inputContainer.appendChild(formInput);

        outerContainer1.appendChild(inputContainer);

        //---------------------------------------------------------------------------------------

        //TARGA--------------------------------------------------------------------------------

        var inputContainer=document.createElement("div");
        inputContainer.setAttribute("class","popupNuovaPrenotazioneVeicoloInputContainer");

        var formInputLabel=document.createElement("div");
        formInputLabel.setAttribute("class","popupNuovaPrenotazioneVeicoloInputLabel");
        formInputLabel.innerHTML="Targa";

        inputContainer.appendChild(formInputLabel);

        var formInput=document.createElement("textarea");
        formInput.setAttribute("class","popupNuovaPrenotazioneVeicoloInput");
        formInput.setAttribute("id","targa");

        inputContainer.appendChild(formInput);

        outerContainer1.appendChild(inputContainer);

        //---------------------------------------------------------------------------------------

        Swal.fire
        ({
            title:"Aggiungi veicolo",
            width:"100%",
            html: outerContainer1.outerHTML,
            //position:"top",
            showCloseButton: true,
            showConfirmButton:true,
            confirmButtonText: "Conferma",
            allowOutsideClick:false,
            onOpen : function()
                    {
                        document.getElementById("swal2-title").style.fontSize="18px";
                        document.getElementsByClassName("swal2-confirm")[0].style.width="calc(100% - 30px)";
                        document.getElementsByClassName("swal2-confirm")[0].style.borderRadius="3px";
                        document.getElementsByClassName("swal2-confirm")[0].style.backgroundColor="rgb(48, 133, 214";
                        document.getElementsByClassName("swal2-confirm")[0].style.boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";
                    }
        }).then((result) => 
        {
            if (result.value)
            {
                var marca=document.getElementById("marca").value;
                var modello=document.getElementById("modello").value;
                var targa=document.getElementById("targa").value;
                if(marca=="" || modello=="" || targa=="")
                {
                    Swal.fire
                    ({
                        icon:"error",
                        title: "Compila tutti i campi",
                        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
                    }).then((result) => 
                    {
                        checkNuovoAutomezzo(select);
                    });
                }
                else
                {
                    $.post("inserisciNuovoAutomezzo.php",
                    {
                        marca,
                        modello,
                        targa
                    },
                    function(response, status)
                    {
                        console.log(response)
                        if(status=="success")
                        {
                            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                            {
                                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                            }
                            else
                            {
                                Swal.fire
                                ({
                                    icon:"success",
                                    title: 'Veicolo aggiunto',
                                    timer: 2000,
                                    showConfirmButton:false,
                                    timerProgressBar: true,
                                    onBeforeOpen: () => 
                                    {
                                        document.getElementsByClassName("swal2-title")[0].style.color="gray";
                                        document.getElementsByClassName("swal2-title")[0].style.fontSize="18px";
                                    }
                                }).then((result) => 
                                {
                                    getPopupPrenotazioneVeicolo();
                                });
                            }
                        }
                    });
                }
            }
        });
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
    var text = document.getElementById('note');
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
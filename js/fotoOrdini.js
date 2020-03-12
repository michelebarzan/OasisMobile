var nomePagina="Foto ordini";
var files;
var pageInfo=
{
    pagina:"fotoOrdini.html",
    nomePagina:"Foto ordini",
    id_pagina:"1036",
    fileName:"fotoOrdini"
};

async function onloadfotoOrdini()
{
    chekcSincronizzazione();
    getElencoFotoOrdini();
    addTopButton();
}
function chekcSincronizzazione()
{
    getSystemToast("<i class='fad fa-spinner-third fa-spin'></i><span>Controllo sincronizzazione...</span>");
    $.get("chekcSincronizzazioneFotoOrdini.php",
    function(response, status)
    {
        if(status=="success")
        {
            removeSystemToast();
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore sincronizzazione. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                var missingFolders=JSON.parse(response);
				console.log(missingFolders);
                if(missingFolders.length>0)
                    getSystemToast("<i class='fal fa-exclamation-triangle'></i><span style='text-decoration:underline' onclick='sincronizzaFotoOrdini()'>Sincronizza foto</span>");
                else
                {
                    getSystemToast("<i class='fal fa-check-circle'></i><span>Foto sincronizzate</span>");
                    setTimeout(function(){ removeSystemToast(); }, 5000);
                }
                }
        }
        else
        {
            Swal.fire({icon:"error",title: "Errore sincronizzazione. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
            console.log(status);
        }
    });
}
async function sincronizzaFotoOrdini()
{
    removeSystemToast();
    getSystemToast("<i class='fad fa-spinner-third fa-spin'></i><span>Sincronizzazione in corso...</span>");
    var id_utente=await getSessionValue("id_utente");
    $.post("sincronizzaFotoOrdini.php",
    {
        id_utente
    },
    function(response, status)
    {
        if(status=="success")
        {
            removeSystemToast();
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore sincronizzazione. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                getSystemToast("<i class='fal fa-check-circle'></i><span>Foto sincronizzate</span>");
                setTimeout(function(){ removeSystemToast(); }, 5000);
                getElencoFotoOrdini();
            }
        }
        else
        {
            Swal.fire({icon:"error",title: "Errore sincronizzazione. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
            console.log(status);
        }
    });
}
function searchFotoOrdini(value)
{
    $(".ordine-outer-container").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}
async function getElencoFotoOrdini()
{
    var container=document.getElementById("containerFotoOrdini");
    container.innerHTML="";
    getFaSpinner(container,"container","Caricamento in corso...");
    document.getElementById("searcBarFotoOrdini").value="";
    var pathBarFotoOrdini=document.getElementById("pathBarFotoOrdini");
    pathBarFotoOrdini.innerHTML="";
    var i=document.createElement("i");
    i.setAttribute("class","fas fa-folder");
    pathBarFotoOrdini.appendChild(i);

    var button=document.createElement("button");
    button.setAttribute("onclick","getElencoFotoOrdini()");
    button.innerHTML="Ordini";
    pathBarFotoOrdini.appendChild(button);

    var ordini=await getFotoOrdini();
    removeFaSpinner("container");
    goToTop();
    ordini.forEach(ordine => 
    {
        var ordineOuterContainer=document.createElement("button");
        ordineOuterContainer.setAttribute("class","ordine-outer-container");
        ordineOuterContainer.setAttribute("onclick","getElencoStazioniOrdine('"+ordine+"')");

        var icon=document.createElement("i");
        icon.setAttribute("class","fas fa-folder");
        ordineOuterContainer.appendChild(icon);

        var span=document.createElement("span");
        span.innerHTML=ordine;
        ordineOuterContainer.appendChild(span);

        container.appendChild(ordineOuterContainer);
    });
}
async function getElencoStazioniOrdine(ordine)
{
    var pathBarFotoOrdini=document.getElementById("pathBarFotoOrdini");
    pathBarFotoOrdini.innerHTML="";
    var i=document.createElement("i");
    i.setAttribute("class","fas fa-folder");
    pathBarFotoOrdini.appendChild(i);

    var button=document.createElement("button");
    button.setAttribute("onclick","getElencoFotoOrdini()");
    button.innerHTML="Ordini";
    pathBarFotoOrdini.appendChild(button);

    var arrow=document.createElement("div");
    arrow.setAttribute("class","arrow-pathBarFotoOrdini");
    arrow.innerHTML=">";
    pathBarFotoOrdini.appendChild(arrow);

    var button=document.createElement("button");
    button.setAttribute("onclick","getElencoStazioniOrdine('"+ordine+"')");
    button.innerHTML=ordine;
    pathBarFotoOrdini.appendChild(button);

    var container=document.getElementById("containerFotoOrdini");
    container.innerHTML="";
    var stazioniOrdine=await getFotoStazioniOrdine(ordine);
    stazioniOrdine.forEach(stazione => 
    {
        var stazioneOuterContainer=document.createElement("button");
        stazioneOuterContainer.setAttribute("class","stazione-outer-container");
        stazioneOuterContainer.setAttribute("onclick","getElencoFotoOrdine('"+ordine+"','"+stazione+"')");

        var icon=document.createElement("i");
        icon.setAttribute("class","fas fa-folder");
        stazioneOuterContainer.appendChild(icon);

        var span=document.createElement("span");
        span.innerHTML=stazione;
        stazioneOuterContainer.appendChild(span);

        container.appendChild(stazioneOuterContainer);
    });
}
async function getElencoFotoOrdine(ordine,stazione)
{
    var pathBarFotoOrdini=document.getElementById("pathBarFotoOrdini");
    pathBarFotoOrdini.innerHTML="";
    var i=document.createElement("i");
    i.setAttribute("class","fas fa-folder");
    pathBarFotoOrdini.appendChild(i);

    var button=document.createElement("button");
    button.setAttribute("onclick","getElencoFotoOrdini()");
    button.innerHTML="Ordini";
    pathBarFotoOrdini.appendChild(button);

    var arrow=document.createElement("div");
    arrow.setAttribute("class","arrow-pathBarFotoOrdini");
    arrow.innerHTML=">";
    pathBarFotoOrdini.appendChild(arrow);

    var button=document.createElement("button");
    button.setAttribute("onclick","getElencoStazioniOrdine('"+ordine+"')");
    button.innerHTML=ordine;
    pathBarFotoOrdini.appendChild(button);

    var arrow=document.createElement("div");
    arrow.setAttribute("class","arrow-pathBarFotoOrdini");
    arrow.innerHTML=">";
    pathBarFotoOrdini.appendChild(arrow);

    var button=document.createElement("button");
    button.setAttribute("onclick","getElencoFotoOrdine('"+ordine+"','"+stazione+"')");
    button.innerHTML=stazione;
    pathBarFotoOrdini.appendChild(button);

    var container=document.getElementById("containerFotoOrdini");
    container.innerHTML="";
    var fotoOrdine=await getFotoOrdine(ordine,stazione);
    console.log(fotoOrdine);
    fotoOrdine.forEach(foto => 
    {
        var fotoOuterContainer=document.createElement("button");
        fotoOuterContainer.setAttribute("class","foto-outer-container");
        //fotoOuterContainer.setAttribute("onclick","");

        var img=document.createElement("img");
        img.setAttribute("src",foto.percorso);
        //img.setAttribute("onerror","window.alert('error')");
        fotoOuterContainer.appendChild(img);

        var div=document.createElement("div");
        div.innerHTML=foto.nomeFile;
        fotoOuterContainer.appendChild(div);

        container.appendChild(fotoOuterContainer);
    });
}
function getFotoOrdine(ordine,stazione)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getFotoOrdine.php",
        {
            ordine,
            stazione
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
                    resolve(JSON.parse(response));
            }
            else
                resolve([]);
        });
    });
}
function getFotoStazioniOrdine(ordine)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getFotoStazioniOrdine.php",
        {
            ordine
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
                    resolve(JSON.parse(response));
            }
            else
                resolve([]);
        });
    });
}
function getFotoOrdini()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getFotoOrdini.php",
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
                    resolve(JSON.parse(response));
            }
            else
                resolve([]);
        });
    });
}
async function checkImage(input)
{
    var formats=["jpg","png","jpeg"];

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-foto-ordini-outer-container");

    files=input.files;
    console.log(files);
    var i=0;

    var row1=document.createElement("div");
    row1.setAttribute("class","popup-foto-ordini-row");
    row1.setAttribute("id","nFotoOrdini");
    row1.setAttribute("style","padding-left:5px;padding-right:5px;width:100%;color:#EBEBEB;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","justify-content: start;flex-wrap: wrap;flex-direction:row;min-height:120px;max-height:330px;overflow-y:auto");

    files.forEach(function(file)
    {
        var nameArray=file.name.split(".");
        var format=nameArray.slice(-1)[0];
        if(formats.includes(format))
        {
            var img=document.createElement("img");
            img.setAttribute("id","popupFotoOrdiniImgPreview"+i);
            row.appendChild(img);
            i++;
        }
    });

    var nFoto=i;
    row1.innerHTML=nFoto+" foto selezionate";
    outerContainer.appendChild(row1);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","padding-left:5px;padding-right:5px;width:100%;color:#EBEBEB;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:10px;margin-top:10px;text-decoration:underline");
    row.innerHTML="Stazione";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","padding-left:5px;padding-right:5px;width:100%;color:#EBEBEB;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:15px");

    var selectStazione=document.createElement("select");
    selectStazione.setAttribute("id","popupFotoOrdiniSelectStazione");
    var stazioni=await getStazioni();
    stazioni.forEach(function (stazione)
    {
        var option=document.createElement("option");
        option.setAttribute("value",stazione);
        option.innerHTML=stazione;
        selectStazione.appendChild(option);
    });
    row.appendChild(selectStazione);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","padding-left:5px;padding-right:5px;width:100%;color:#EBEBEB;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:10px;text-decoration:underline");
    row.innerHTML="Ordine";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","padding-left:5px;padding-right:5px;width:100%;color:#EBEBEB;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:15px");

    var inputOrdine=document.createElement("input");
    inputOrdine.setAttribute("id","popupFotoOrdiniInputOrdine");
    inputOrdine.setAttribute("type","text");
    row.appendChild(inputOrdine);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-evenly;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("id","popupFotoOrdiniConfirmButton");
    confirmButton.setAttribute("onclick","uploadFotoOrdine(this)");
    confirmButton.innerHTML='<span>CONFERMA</span><i class="fad fa-paper-plane"></i>';
    row.appendChild(confirmButton);

    outerContainer.appendChild(row);

    Swal.fire(
    {
        position:"top",
        width:"100%",
        background:"#404040",
        title: "Caricamento foto ordine",
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.color="#EBEBEB";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Quicksand',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingLeft="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";

                    for (let index = 0; index < i; index++)
                    {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            $("#popupFotoOrdiniImgPreview"+index).attr('src', e.target.result);
                        }

                        reader.readAsDataURL(files[index]);
                    }
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    });
}
function getStazioni()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getStazioni.php",
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
                    resolve(JSON.parse(response));
            }
            else
                resolve([]);
        });
    });
}
async function uploadFotoOrdine(button)
{
    button.disabled=true;
    var icon=button.getElementsByTagName("i")[0];
    var span=button.getElementsByTagName("span")[0];
    span.innerHTML="CARICAMENTO<div id='progressoCaricamentoUploadFotoOrdine'>1</div>/"+files.length;
    icon.className="fad fa-spinner-third fa-spin";
    let progressoCaricamentoUploadFotoOrdine=1;

    var stazione=document.getElementById("popupFotoOrdiniSelectStazione").value;
    var ordine=document.getElementById("popupFotoOrdiniInputOrdine").value;

    var error=false;

    if(stazione==null || ordine==null || stazione=="" || ordine=="" || files.length==0 || ordine.length!=8)
    {
        window.alert("Errore\n\nCompila tutti i campi.\nRicorda: l' ordine deve essere composto da 8 caratteri");
        icon.className="fad fa-paper-plane";
        span.innerHTML="CONFERMA";
        button.disabled=false;
    }
    else
    {
        for (let index = 0; index < files.length; index++) 
        {
            document.getElementById("progressoCaricamentoUploadFotoOrdine").innerHTML=progressoCaricamentoUploadFotoOrdine;
            progressoCaricamentoUploadFotoOrdine++;
            const file = files[index];
            var response=await uploadFoto(file,stazione,ordine);
            if(response.indexOf("error")>-1 || response.indexOf("notice")>-1 || response.indexOf("warning")>-1)
                error=true;
        }
        if(error)
        {
            window.alert("Errore\n\nImpossibile caricare le foto.\nSe il problema persiste contatta l'amministratore");
            console.log(response);
            icon.className="fad fa-exclamation-triangle";
            span.innerHTML="ERRORE";
            setTimeout(function(){ icon.className="fad fa-paper-plane"; button.disabled=false;span.innerHTML="CONFERMA";}, 3000);
        }
        else
        {
            Swal.fire({width:"100%",background:"#404040",icon:"success",title: "Le foto dell' ordine sono state caricate",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#EBEBEB";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
            sincronizzaFotoOrdini();
        }
    }
}
function uploadFoto(file,stazione,ordine)
{
    return new Promise(function (resolve, reject) 
    {
        var data= new FormData();
        data.append('file',file);
        data.append("stazione",stazione);
        data.append("ordine",ordine);
        $.ajax(
        {
            url:'uploadFotoOrdine.php',
            data:data,
            processData:false,
            contentType:false,
            type:'POST',
            success:function(response)
                {
                    resolve(response);
                }
        });
    });
}
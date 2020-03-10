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
    getElencoFotoOrdini();
    addTopButton();
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
    fotoOrdine.forEach(foto => 
    {
        var fotoOuterContainer=document.createElement("button");
        fotoOuterContainer.setAttribute("class","foto-outer-container");
        //fotoOuterContainer.setAttribute("onclick","");

        var img=document.createElement("img");
        img.setAttribute("src",foto.percorso);
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
function checkImage(input)
{
    var formats=["jpg","png","jpeg"];

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-foto-ordini-outer-container");

    files=input.files;
    console.log(files);
    var i=0;

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","align-items: center;justify-content: start;flex-wrap: wrap;flex-direction:row;min-height:120px;");

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

    outerContainer.appendChild(row);

    Swal.fire(
    {
        width:"100%",
        title: "Titolo",
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.color="gray";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";

                    /*
                    var reader = new FileReader();

            reader.onload = function (e) {
                $("#popupFotoOrdiniImgPreview"+i).attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[i]);
                    */
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    });
}
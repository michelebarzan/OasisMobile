var nomePagina="Documenti";
var pageInfo=
{
    pagina:"documentazione.html",
    nomePagina:"Documenti",
    id_pagina:"1044",
    fileName:"documentazione"
};
var orderBy='nome ASC';
var documenti;

function toggleOrderIcon(button)
{
    var span=button.getElementsByTagName("span")[0];
    if(orderBy=="nome ASC")
    {
        orderBy='dataOra DESC';
        span.innerHTML="Data";
        getElencoDocumentazione();
    }
    else
    {
        orderBy='nome ASC';
        span.innerHTML="Nome";
        getElencoDocumentazione();
    }
}

async function onloaddocumentazione()
{
    getElencoCategorie();
    getElencoDocumentazione();

    //Aggiunge il bottone go to top
    addTopButton();
}
async function getElencoCategorie()
{
    var select=document.getElementById("selectFiltroCategoria");
    select.innerHTML="";

    var option=document.createElement("option");
    option.setAttribute("value","");
    option.setAttribute("selected","selected");
    option.innerHTML="Tutte le categorie";
    select.appendChild(option);

    var categorie=await getCategorie();
    categorie.forEach(function(categoria)
    {
        var option=document.createElement("option");
        option.setAttribute("value",categoria);
        option.innerHTML=categoria;
        select.appendChild(option);
    });

    var datalistCategorie=document.getElementById("datalistCategorie");
    datalistCategorie.innerHTML="";

    categorie.forEach(function(categoria)
    {
        var option=document.createElement("option");
        option.setAttribute("value",categoria);
        datalistCategorie.appendChild(option);
    });

}
function getCategorie()
{
    return new Promise(function (resolve, reject) 
    {
        var categoria=document.getElementById("selectFiltroCategoria").value;
        $.get("getCategorieDocumentazione.php",
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
                        console.log(error);
                        console.log(response);
                        resolve([]);
                    }
                }
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(status);
                resolve([]);
            }
        });
    });
}
function isOdd(num) { return num % 2;}
async function getElencoDocumentazione()
{
    var container=document.getElementById("containerDocumentazione");
    container.innerHTML="";

    documenti=await getDocumenti();

    let i=0;
    documenti.forEach(documento => 
    {
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","documenti-row-item");

        var infoBar=document.createElement("div");
        infoBar.setAttribute("class","documenti-row-item-info-bar");
        infoBar.setAttribute("id","infoBar"+documento.id_documento);

        var div=document.createElement("div");
        div.setAttribute("class","info-bar-container-nome");
        div.setAttribute("id","containerNome"+documento.id_documento);
        div.innerHTML=documento.nome;
        infoBar.appendChild(div);

        var menuContainer=document.createElement("div");
        menuContainer.setAttribute("id","menuContainer"+documento.id_documento);
        menuContainer.setAttribute("class","info-bar-container-hidden-button");

        var shareButton=document.createElement("button");
        shareButton.setAttribute("class","info-bar-hidden-button");
        shareButton.setAttribute("onclick","shareDocumento('"+documento.nomeFile+"','"+documento.nome+"')");
        var shareIcon=document.createElement("i");
        shareIcon.setAttribute("class","fal fa-share-alt");
        shareButton.appendChild(shareIcon);
        menuContainer.appendChild(shareButton);

        var expandButton=document.createElement("button");
        expandButton.setAttribute("class","info-bar-hidden-button");
        expandButton.setAttribute("onclick","expandDocumento('"+documento.nomeFile+"','"+documento.nome+"')");
        var expandIcon=document.createElement("i");
        expandIcon.setAttribute("class","far fa-expand-arrows-alt");
        expandButton.appendChild(expandIcon);
        menuContainer.appendChild(expandButton);

        infoBar.appendChild(menuContainer);

        var menuButton=document.createElement("button");
        menuButton.setAttribute("class","info-bar-menu-button");
        menuButton.setAttribute("onclick","toggleMenuButtons(this,"+documento.id_documento+")");
        var menuIcon=document.createElement("i");
        menuIcon.setAttribute("class","far fa-ellipsis-v");
        menuButton.appendChild(menuIcon);
        infoBar.appendChild(menuButton);
        
        outerContainer.appendChild(infoBar);

        var formato=documento.nomeFile.split(".")[documento.nomeFile.split(".").length-1];
        if(formato=="pdf")
        {
            var documentazioneContainer=document.createElement("iframe");
            documentazioneContainer.setAttribute("onload","fixPdf(this)");
            //documentazioneContainer.setAttribute("src","http://remote.oasisgroup.it/OasisDocumentazione/pdf.js/web/viewer.html?file=attachment/"+documento.nomeFile);
            documentazioneContainer.setAttribute("src","http://remote.oasisgroup.it/OasisDocumentazione/pdf.js/web/viewer.html?file=attachment/"+documento.nomeFile);
            documentazioneContainer.setAttribute("class","documentazione-container");
            outerContainer.appendChild(documentazioneContainer);
        }

        container.appendChild(outerContainer);
        
        i++;
    });
}
function shareDocumento(nomeFile,nome)
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-documentazione-outer-container");

    /*var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Condividi via mail";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-documentazione-input");
    input.setAttribute("id","popupDocumentazioneNome");
    
    row.appendChild(input);

    outerContainer.appendChild(row);*/

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:10px;");

    var subjectEncoded = encodeURIComponent(nome);
    var bodyEncoded = encodeURIComponent("http://remote.oasisgroup.it/OasisDocumentazione/pdf.js/web/viewer.html?file=attachment/"+nomeFile);

    var buttonScegliDocumento=document.createElement("a");
    buttonScegliDocumento.setAttribute("href","mailto:?subject="+subjectEncoded+"&body=" + bodyEncoded);
    buttonScegliDocumento.setAttribute("class","popup-documentazione-button");
    buttonScegliDocumento.setAttribute("style","width:100%;text-decoration:none");
    buttonScegliDocumento.innerHTML='<span>Invia mail</span><i class="fal fa-envelope"></i>';
    
    row.appendChild(buttonScegliDocumento);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:10px;");

    var buttonScegliDocumento=document.createElement("a");
    buttonScegliDocumento.setAttribute("href","https://api.whatsapp.com/send?text="+bodyEncoded);
    buttonScegliDocumento.setAttribute("class","popup-documentazione-button");
    buttonScegliDocumento.setAttribute("style","width:100%;text-decoration:none");
    buttonScegliDocumento.innerHTML='<span>Invia Whatsapp</span><i class="fab fa-whatsapp"></i>';
    
    row.appendChild(buttonScegliDocumento);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:center;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
    row.innerHTML="Oppure copia il link";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;justify-content:flex-start");

    var input=document.createElement("textarea");
    input.setAttribute("style","font-size:10px;");
    input.setAttribute("class","popup-documentazione-input");
    input.innerHTML="http://remote.oasisgroup.it/OasisDocumentazione/pdf.js/web/viewer.html?file=attachment/"+nomeFile;
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:"100%",
        background:"#404040",
        title:"Condividi documento",
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    }).then((result) => 
    {
        
    });
}
function expandDocumento(nomeFile,nome)
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("id","expandPdfOuterContainer");

    var infoBar=document.createElement("div");
    infoBar.setAttribute("id","expandPdfOuterContainerInfoBar");

    var span=document.createElement("span");
    span.innerHTML=nome;
    infoBar.appendChild(span);

    var shareButton=document.createElement("button");
    shareButton.setAttribute("onclick","shareDocumento('"+nomeFile+"','"+nome+"')");
    var shareIcon=document.createElement("i");
    shareIcon.setAttribute("class","fal fa-share-alt");
    shareButton.appendChild(shareIcon);
    infoBar.appendChild(shareButton);

    var closeButton=document.createElement("button");
    closeButton.setAttribute("onclick","document.getElementById('expandPdfOuterContainer').remove()");
    closeButton.setAttribute("style","font-size:18px;");
    var closeIcon=document.createElement("i");
    closeIcon.setAttribute("class","fal fa-times");
    closeButton.appendChild(closeIcon);
    infoBar.appendChild(closeButton);

    outerContainer.appendChild(infoBar);

    var documentazioneContainer=document.createElement("iframe");
    documentazioneContainer.setAttribute("onload","this.contentWindow.document.getElementById('toolbarViewer').style.backgroundColor='#404040';")
    //documentazioneContainer.setAttribute("src","http://remote.oasisgroup.it/OasisDocumentazione/pdf.js/web/viewer.html?file=attachment/"+documento.nomeFile);
    documentazioneContainer.setAttribute("src","http://remote.oasisgroup.it/OasisDocumentazione/pdf.js/web/viewer.html?file=attachment/"+nomeFile);
    documentazioneContainer.setAttribute("id","expandPdfIframe");
    outerContainer.appendChild(documentazioneContainer);

    document.body.appendChild(outerContainer);
}
function toggleMenuButtons(menuButton,id_documento)
{
    var menuIcon=menuButton.getElementsByTagName("i")[0];
    if($("#menuContainer"+id_documento).is(":hidden"))
    {
        menuIcon.setAttribute("class","fal fa-times");

        $("#containerNome"+id_documento).css("visibility","hidden");
        $("#menuContainer"+id_documento).show(100,"swing");
        
        setTimeout(function()
        {
            $("#menuContainer"+id_documento).css("display","flex");
            $("#containerNome"+id_documento).hide();
        }, 100);
    }
    else
    {
        menuIcon.setAttribute("class","far fa-ellipsis-v");

        $("#menuContainer"+id_documento).hide(100,"swing");
        $("#containerNome"+id_documento).show(100,"swing");
        
        setTimeout(function()
        {
            $("#containerNome"+id_documento).css("visibility","");
        }, 100);
    }
}
function fixPdf(iframe)
{
    iframe.contentWindow.document.body.style.backgroundColor="#555555";
    iframe.contentWindow.document.body.style.backgroundImage="none";

    iframe.contentWindow.document.getElementById("mainContainer").style.minWidth="0";

    iframe.contentWindow.document.getElementById("sidebarContainer").style.display="none";
    iframe.contentWindow.document.getElementById("secondaryToolbar").style.display="none";
    iframe.contentWindow.document.getElementsByClassName("toolbar")[0].style.display="none";

    iframe.contentWindow.document.getElementById("viewerContainer").style.top="0px";
    iframe.contentWindow.document.getElementById("viewerContainer").style.bottom="0px";
    iframe.contentWindow.document.getElementById("viewerContainer").style.left="0px";
    iframe.contentWindow.document.getElementById("viewerContainer").style.right="0px";

    iframe.contentWindow.document.getElementById("viewer").style.margin="0px";
    iframe.contentWindow.document.getElementById("viewer").style.width="100%";
    iframe.contentWindow.document.getElementById("viewer").style.height="100%";
}
function getDocumenti()
{
    return new Promise(function (resolve, reject) 
    {
        var categoria=document.getElementById("selectFiltroCategoria").value;
        $.get("getDocumenti.php",
        {
            orderBy,
            categoria
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
                        console.log(error);
                        console.log(response);
                        resolve([]);
                    }
                }
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(status);
                resolve([]);
            }
        });
    });
}
function popupCaricaDocumento()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-documentazione-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Nome";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-documentazione-input");
    input.setAttribute("id","popupDocumentazioneNome");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Categoria";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("list","datalistCategorie");
    input.setAttribute("class","popup-documentazione-input");
    input.setAttribute("id","popupDocumentazioneCategoria");
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Documento";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","display:flex;width:100%;margin-bottom:5px;justify-content:flex-start;align-items:center;flex-direction: row;margin-top:2px");

    var buttonScegliDocumento=document.createElement("button");
    buttonScegliDocumento.setAttribute("class","popup-documentazione-button");
    buttonScegliDocumento.setAttribute("style","width:calc(50% - 5px)");
    buttonScegliDocumento.setAttribute("onclick","document.getElementById('inputScegliFileDocumentazione').click()");
    buttonScegliDocumento.innerHTML='<span>Scegli file</span><i class="fad fa-folder-open"></i>';
    
    row.appendChild(buttonScegliDocumento);

    var containerDocumentoScelto=document.createElement("div");
    containerDocumentoScelto.setAttribute("id","containerDocumentoScelto");

    row.appendChild(containerDocumentoScelto);

    var inputScegliDocumento=document.createElement("input");
    inputScegliDocumento.setAttribute("type","file");
    inputScegliDocumento.setAttribute("accept",".pdf");
    inputScegliDocumento.setAttribute("id","inputScegliFileDocumentazione");
    inputScegliDocumento.setAttribute("style","display:none");
    inputScegliDocumento.setAttribute("onchange","getFileDocumentazione(this)");

    row.appendChild(inputScegliDocumento);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-documentazione-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    var caricaButton=document.createElement("button");
    caricaButton.setAttribute("class","popup-documentazione-button");
    caricaButton.setAttribute("style","width:100%;");
    caricaButton.setAttribute("onclick","caricaDocumento()");
    caricaButton.innerHTML='<span>Carica documento</span><i class="fal fa-file-upload"></i>';
    row.appendChild(caricaButton);    

    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:"100%",
        background:"#404040",
        title:"Carica documento",
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    }).then((result) => 
    {
        
    });
}
async function caricaDocumento()
{
    var nome=document.getElementById("popupDocumentazioneNome").value;
    var categoria=document.getElementById("popupDocumentazioneCategoria").value;
    var documento=document.getElementById("inputScegliFileDocumentazione").files[0];

    if(nome=="" || categoria=="" || documento==null)
    {
        window.alert("Errore\n\nCompila tutti i campi e scegli un file");
    }
    else
    {
        var id_utente=await getSessionValue("id_utente");
        var data= new FormData();
        data.append('id_utente',id_utente);
        data.append('nome',nome);
        data.append('categoria',categoria);
        data.append('documento',documento);
        $.ajax(
        {
            url:'caricaDocumentazione.php',
            data:data,
            processData:false,
            contentType:false,
            type:'POST',
            success:function(response)
                {
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    {
                        console.log(response);
                        window.alert("Errore\n\nSe il problema persiste contatta l'amministratore");
                    }
                    else
                    {
                        Swal.close();
                        Swal.fire
                        ({
                            width:"100%",
                            background:"#404040",
                            icon:"success",
                            title: "Docuemento caricato",
                            showConfirmButton:false,
                            showCloseButton:true,
                            onOpen : function()
                            {
                                document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                                document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                                document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                                document.getElementsByClassName("swal2-close")[0].style.outline="none";
                            }
                        }).then((result) => 
                        {
                            onloaddocumentazione();
                        });
                    }
                }
        });
    }
}
function getFileDocumentazione(input)
{
    var documento=input.files[0];
    var formato=documento.name.split(".")[documento.name.split(".").length - 1];

    if(formato=="pdf")
    {
        document.getElementById("containerDocumentoScelto").innerHTML=documento.name;
    }
    else
    {
        document.getElementById("containerDocumentoScelto").innerHTML="<span style='color:#DA6969'>Formato non valido</span>";
        document.getElementById("inputScegliFileDocumentazione").value = "";
    }
}
function searchdocumentazione(value)
{
    $(".documenti-row-item").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}
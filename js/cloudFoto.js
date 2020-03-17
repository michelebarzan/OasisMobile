var nomePagina="Cloud Foto";
var pageInfo=
{
    pagina:"cloudFoto.html",
    nomePagina:"Cloud Foto",
    id_pagina:"1038",
    fileName:"cloudFoto"
};
var nomiCartelle=[];
var cartella_corrente;

async function onloadcloudFoto()
{
    getElencoContenutoCartella(1);
}
function getPath(id_cartella,cartella)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getPathCloudFoto.php",
        {
            id_cartella,
            cartella
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
async function getElencoContenutoCartella(id_cartella)
{
    var container=document.getElementById("containerCloudFoto");
    container.innerHTML="";
    getFaSpinner(container,"container","Caricamento in corso...");

    cartella_corrente=parseInt(id_cartella);

    //console.clear();

    var pathBarCloudFoto=document.getElementById("innerPathBarCloudFoto");
    pathBarCloudFoto.innerHTML="";
    var cartella=await getNomeCartellaCloudFoto(id_cartella);
    //console.log("---"+cartella+"---");
    
    if(cartella.indexOf("OasisCloudFoto")>-1)
    {
        var button=document.createElement("button");
        button.setAttribute("class","path-bar-button");
        button.setAttribute("id","pathBarButton"+id_cartella);
        button.setAttribute("onclick","getElencoContenutoCartella('"+id_cartella+"')");
        button.innerHTML=cartella;
        pathBarCloudFoto.appendChild(button);
    }
    else
    {
        var path=await getPath(id_cartella,cartella);
        //console.log(path);

        let i=0;
        path.forEach(function(cartellaObj)
        {
            var button=document.createElement("button");
            button.setAttribute("class","path-bar-button");
            button.setAttribute("id","pathBarButton"+cartellaObj.id_cartella);
            button.setAttribute("onclick","getElencoContenutoCartella('"+cartellaObj.id_cartella+"')");
            button.innerHTML=cartellaObj.cartella;
            pathBarCloudFoto.appendChild(button);

            if(cartellaObj.id_cartella!=id_cartella)
            {
                var arrow=document.createElement("div");
                arrow.setAttribute("class","arrow-path-bar");
                arrow.innerHTML=">";
                pathBarCloudFoto.appendChild(arrow);
            }
            i++;
        });
    }

    var cartelle=await getCartelle(id_cartella);
    var files=await getFiles(id_cartella);

    removeFaSpinner("container");

    nomiCartelle=[];
    cartelle.forEach(function(item)
    {
        nomiCartelle.push(item.cartella);
    });

    var array= cartelle.concat(files);
    array.forEach(function(item)
    {
        item.dataOraString=item.dataOra.date;
    });
    array.sort( compare );

    //console.log(array);

    let i=0;
    array.forEach(function(item)
    {
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","cloud-foto-item-outer-container");
        if(i==array.length-1)
        {
            outerContainer.setAttribute("style","border-bottom:0.5px solid transparent");
        }

        var button=document.createElement("button");
        button.setAttribute("class","cloud-foto-item-button");
        if(item.tipo=="cartella")
            button.setAttribute("onclick","getElencoContenutoCartella('"+item.id_cartella+"')");
        if(item.tipo=="file")
        {
            button.setAttribute("onclick","expandImage(this.firstChild,'"+item.nomeFile+"')");
        }
        if(item.tipo=="cartella")
        {
            var icon=document.createElement("i");
            icon.setAttribute("class","fas fa-folder");
            button.appendChild(icon);
        }
        if(item.tipo=="file")
        {
            var img=document.createElement("img");
            img.setAttribute("src",location.protocol+"//"+item.server+"/"+item.path);
            button.appendChild(img);
        }

        var name=document.createElement("div");
        name.setAttribute("class","cloud-foto-item-name");
        if(item.tipo=="cartella")
        {
            name.innerHTML=item.cartella;
        }
        if(item.tipo=="file")
        {
            name.innerHTML=item.nomeFile;
        }
        button.appendChild(name);

        outerContainer.appendChild(button);

        var date=document.createElement("div");
        date.setAttribute("class","cloud-foto-item-date");
        var dataOraString=item.dataOraString.replace(" ","<br>");
        dataOraString=dataOraString.split(".")[0];
        date.innerHTML=dataOraString;
        outerContainer.appendChild(date);

        var actionButton=document.createElement("button");
        actionButton.setAttribute("class","cloud-foto-item-action-button");
        actionButton.innerHTML='<i class="fal fa-ellipsis-v"></i>';
        
        outerContainer.appendChild(actionButton);

        container.appendChild(outerContainer);

        i++;
    });
}
function getNomeCartellaCloudFoto(id_cartella)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getNomeCartellaCloudFoto.php",
        {
            id_cartella
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve("");
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        resolve("");
                    }
                }
            }
            else
                resolve("");
        });
    });
}
function compare( a, b ) 
{
    if ( a.dataOraString < b.dataOraString )
    {
        return -1;
    }
    if ( a.dataOraString > b.dataOraString )
    {
        return 1;
    }
    return 0;
}
function getContenutoCartella(id_cartella)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getContenutoCartella.php",
        {
            id_cartella
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
function getIdCartella(cartella)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getIdCartellaCloudFoto.php",
        {
            cartella
        },
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve("");
                }
                else
                    resolve(response);
            }
            else
                resolve("");
        });
    });
}
function getCartelle(id_cartella)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getCartelleCloudFoto.php",
        {
            id_cartella
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
function getFiles(id_cartella)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getFilesCloudFoto.php",
        {
            id_cartella
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
function expandImage(img,nomeFile)
{
    var src=img.getAttribute("src");

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-expand-image-outer-container");

    var actionBar=document.createElement("div");
    actionBar.setAttribute("class","popup-expand-image-action-bar");

    var span=document.createElement("span");
    span.innerHTML=nomeFile;
    actionBar.appendChild(span);

    var button=document.createElement("button");
    button.setAttribute("style","font-size:14px");
    button.setAttribute("class","popup-expand-image-action-bar-download-button");
    button.setAttribute("onclick","downloadFoto('"+src+"')");
    button.innerHTML='<i class="fal fa-cloud-download"></i>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("style","margin-left:10px;font-size:18px");
    button.setAttribute("class","popup-expand-image-action-bar-close-button");
    button.setAttribute("onclick","Swal.close()");
    button.innerHTML='<i class="fal fa-times"></i>';
    actionBar.appendChild(button);

    outerContainer.appendChild(actionBar);

    var img=document.createElement("img");
    img.setAttribute("src",src);

    outerContainer.appendChild(img);

    Swal.fire(
    {
        //position:"top",
        width:"100%",
        background:"#404040",
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-popup")[0].style.borderRadius="4px";
                    /*document.getElementsByClassName("swal2-popup")[0].style.paddingRight="0px";*/
                },
        showCloseButton:false,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    });
}
function downloadFoto(src)
{
    window.open("downloadCloudFoto.php?src="+src);
}
function nuovaCarella()
{
    var container=document.getElementById("containerCloudFoto");

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","cloud-foto-item-outer-container");

    var button=document.createElement("button");
    button.setAttribute("class","cloud-foto-item-button");
    //button.setAttribute("onclick","getElencoContenutoCartella('"+item.id_cartella+"')");

    var icon=document.createElement("i");
    icon.setAttribute("class","fas fa-folder");
    button.appendChild(icon);

    var name=document.createElement("div");
    name.setAttribute("class","cloud-foto-item-name");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","cloud-foto-item-input");
    input.setAttribute("id","cloudFotoItemTnputNuovaCartella");
    input.setAttribute("onfocusout","inserisciNuovaCartella(this)");
    input.setAttribute("onkeyup","checkInserisciNuovaCartella(this,event)");
    input.setAttribute("value","Nuova cartella");
    name.appendChild(input);

    button.appendChild(name);

    outerContainer.appendChild(button);

    var date=document.createElement("div");
    date.setAttribute("class","cloud-foto-item-date");
    outerContainer.appendChild(date);

    container.appendChild(outerContainer);

    document.getElementById("cloudFotoItemTnputNuovaCartella").focus();
    document.getElementById("cloudFotoItemTnputNuovaCartella").select();
}
function checkInserisciNuovaCartella(input,event)
{
    if (event.keyCode === 13) {
        input.blur();
    }
}
var nuovaCarellaTentativi=1;
async function inserisciNuovaCartella(input)
{
    var nomeCartella=input.value;
    if(nomiCartelle.includes(nomeCartella))
    {
        Swal.fire({
            icon:"error",
            title: "Errore. La destinazione contiene già una cartella con lo stesso nome",
            showConfirmButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
        }).then((result) => 
        {
            if(nuovaCarellaTentativi==1)
                document.getElementById("cloudFotoItemTnputNuovaCartella").value="Nuova cartella";
            else
                document.getElementById("cloudFotoItemTnputNuovaCartella").value="Nuova cartella ("+nuovaCarellaTentativi+")";
            nuovaCarellaTentativi++;
            inserisciNuovaCartella(document.getElementById("cloudFotoItemTnputNuovaCartella"));
        });
    }
    else
    {
        var id_utente=await getSessionValue("id_utente");
        var cartella=await getNomeCartellaCloudFoto(cartella_corrente);
        var path=await getPath(cartella_corrente,cartella);
        $.post("inserisciNuovaCartellaCloudFoto.php",
        {
            id_utente,
            nomeCartella,
            cartella_corrente,
            path
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
                    getElencoContenutoCartella(cartella_corrente);
                }
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(status);
            }
        });
    }
}
async function cloudFotoIndietro()
{
    if(cartella_corrente!=1)
    {
        var cartella=await getNomeCartellaCloudFoto(cartella_corrente);
        var path=await getPath(cartella_corrente,cartella);

        var pathCartelle=[];
        var pathIdCartelle=[];
        path.forEach(function(item)
        {
            pathCartelle.push(item.cartella);
            pathIdCartelle.push(item.id_cartella);
        });

        var idCartellaBefore=pathIdCartelle.indexOf(cartella_corrente);
        if(idCartellaBefore>-1)
        {
            idCartellaBefore--;
            getElencoContenutoCartella(pathIdCartelle[idCartellaBefore]);
        }
    }
}
async function checkImage(input)
{
    var files=input.files;

    if(files.length>0)
    {
        getSystemToast("<i class='fad fa-spinner-third fa-spin'></i><span>Caricamento in corso...&nbsp(<div id='progressoCaricamentoUploadCloudFoto'>1</div>/"+files.length+")</span>");  
        $("#systemToast span").css("display","flex");
        let progressoCaricamentoUploadCloudFoto=1;

        var error=false;

        for (let index = 0; index < files.length; index++) 
        {
            document.getElementById("progressoCaricamentoUploadCloudFoto").innerHTML=progressoCaricamentoUploadCloudFoto;
            progressoCaricamentoUploadCloudFoto++;
            const file = files[index];
            var id_utente=await getSessionValue("id_utente");
            var cartella=await getNomeCartellaCloudFoto(cartella_corrente);
            var path=await getPath(cartella_corrente,cartella);
            var pathString="";
            path.forEach(function(item)
            {
                if(item.cartella!=null)
                    pathString+=item.cartella+"/";
            });
            var response=await uploadFoto(file,id_utente,pathString);
            if(response.indexOf("error")>-1 || response.indexOf("notice")>-1 || response.indexOf("warning")>-1)
            {
                error=true;
                console.log(response);
            }
        }
        removeSystemToast();
        $("#systemToast span").css("display","");
        if(error)
        {
            //window.alert("Errore\n\nNon è stato possibile caricare tutte le foto.\nSe il problema persiste contatta l'amministratore");
            Swal.fire
            ({
                showConfirmButton:false,
                showCloseButton:true,
                icon:"error",
                title: "Errore. Non è stato possibile caricare alcune le foto",
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
            });
            getElencoContenutoCartella(cartella_corrente);
        }
        else
        {
            getSystemToast("<i class='fal fa-check-circle'></i><span>Foto caricate</span>");
            setTimeout(function(){ removeSystemToast(); }, 5000);
            getElencoContenutoCartella(cartella_corrente);
        }
    }
}
/*async function checkImage(input)
{  
    //var formats=["jpg","png","jpeg"];

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-cloud-foto-outer-container");

    files=input.files;
    //console.log(files);
    var i=0;

    var row1=document.createElement("div");
    row1.setAttribute("class","popup-cloud-foto-row");
    row1.setAttribute("id","nCloudFoto");
    row1.setAttribute("style","padding-left:5px;padding-right:5px;width:100%;color:#EBEBEB;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");

    var row=document.createElement("div");
    row.setAttribute("class","popup-cloud-foto-row");
    row.setAttribute("style","justify-content: start;flex-wrap: wrap;flex-direction:row;min-height:120px;max-height:330px;overflow-y:auto");

    files.forEach(function(file)
    {
        var nameArray=file.name.split(".");
        var format=nameArray.slice(-1)[0];
        //if(formats.includes(format))
        //{
            var img=document.createElement("img");
            img.setAttribute("id","popupCloudFotoImgPreview"+i);
            row.appendChild(img);
            i++;
        //}
    });

    var nFoto=i;
    row1.innerHTML=nFoto+" foto selezionate";
    outerContainer.appendChild(row1);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-cloud-foto-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-evenly;margin-top:10px");

    var confirmButton=document.createElement("button");
    confirmButton.setAttribute("id","popupCloudFotoConfirmButton");
    confirmButton.setAttribute("onclick","uploadCloudFoto(this)");
    confirmButton.innerHTML='<span>CONFERMA</span><i class="fad fa-paper-plane"></i>';
    row.appendChild(confirmButton);

    outerContainer.appendChild(row);

    Swal.fire(
    {
        position:"top",
        width:"100%",
        background:"#404040",
        title: "Caricamento foto",
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
                            $("#popupCloudFotoImgPreview"+index).attr('src', e.target.result);
                        }

                        reader.readAsDataURL(files[index]);
                    }
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    });
}*/
async function uploadCloudFoto(button)
{
    button.disabled=true;
    var icon=button.getElementsByTagName("i")[0];
    var span=button.getElementsByTagName("span")[0];
    span.innerHTML="CARICAMENTO<div id='progressoCaricamentoUploadCloudFoto'>1</div>/"+files.length;
    icon.className="fad fa-spinner-third fa-spin";
    let progressoCaricamentoUploadCloudFoto=1;

    var error=false;

    if(files.length==0)
    {
        window.alert("Errore\n\nNessuna foto selezionata");
        icon.className="fad fa-paper-plane";
        span.innerHTML="CONFERMA";
        button.disabled=false;
    }
    else
    {
        for (let index = 0; index < files.length; index++) 
        {
            document.getElementById("progressoCaricamentoUploadCloudFoto").innerHTML=progressoCaricamentoUploadCloudFoto;
            progressoCaricamentoUploadCloudFoto++;
            const file = files[index];
            var id_utente=await getSessionValue("id_utente");
            var cartella=await getNomeCartellaCloudFoto(cartella_corrente);
            var path=await getPath(cartella_corrente,cartella);
            var pathString="";
            path.forEach(function(item)
            {
                if(item.cartella!=null)
                    pathString+=item.cartella+"/";
            });
            var response=await uploadFoto(file,id_utente,pathString);
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
            getElencoContenutoCartella(cartella_corrente);
            //Swal.fire({width:"100%",background:"#404040",icon:"success",title: "Le foto dell' ordine sono state caricate",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="#EBEBEB";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
        }
    }
}
function uploadFoto(file,id_utente,pathString)
{
    return new Promise(function (resolve, reject) 
    {
        var data= new FormData();
        data.append('file',file);
        data.append('cartella_corrente',cartella_corrente);
        data.append("id_utente",id_utente);
        data.append("pathString",pathString);
        $.ajax(
        {
            url:'uploadFotoCloudFoto.php',
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
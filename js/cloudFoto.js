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
var checkedFiles=[];
var filesLenght;

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
    filesLenght=0;

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
        outerContainer.setAttribute("id","cloudFotoItemOuterContainer"+i);
        outerContainer.setAttribute("number",i);

        outerContainer.setAttribute("tipo",item.tipo);

        if(i==array.length-1)
        {
            outerContainer.setAttribute("style","border-bottom:0.5px solid transparent");
        }

        var button=document.createElement("button");
        button.setAttribute("class","cloud-foto-item-button");
        if(item.tipo=="cartella")
        {
            //button.setAttribute("onlongtouch","clickActionButton("+item.id_cartella+")");
            button.setAttribute("onlongtouch","getCheckboxes("+i+")");
            button.setAttribute("onclick","getElencoContenutoCartella('"+item.id_cartella+"')");
            button.setAttribute("tipo","cartella");
            button.setAttribute("id_cartella",item.id_cartella);
            
            outerContainer.setAttribute("nome",item.cartella);
            outerContainer.setAttribute("id_file_cartella",item.id_cartella);
        }
        if(item.tipo=="file")
        {
            var formato=item.nomeFile.split(".")[item.nomeFile.split(".").length-1];
            //button.setAttribute("onlongtouch","clickActionButton("+item.id_file+")");
            button.setAttribute("onlongtouch","getCheckboxes("+i+")");
            button.setAttribute("onclick","expandImage('"+formato+"',this.firstChild,'"+item.nomeFile+"')");
            button.setAttribute("tipo","file");
            button.setAttribute("nomeFile",item.nomeFile);

            outerContainer.setAttribute("nome",item.nomeFile);
            outerContainer.setAttribute("id_file_cartella",item.id_file);
        }
        if(item.tipo=="cartella")
        {
            var icon=document.createElement("i");
            icon.setAttribute("class","fas fa-folder");
            button.appendChild(icon);
        }
        if(item.tipo=="file")
        {
            if(formato.toLowerCase()=="mp4")
            {
                var video=document.createElement("video");
                //video.setAttribute("controls","controls");
                var source=document.createElement("source");
                source.setAttribute("src",location.protocol+"//"+item.server+"/"+item.path);
                source.setAttribute("type","video/mp4");
                video.appendChild(source);
                button.appendChild(video);
            }
            else
            {
                var img=document.createElement("img");
                img.setAttribute("src",location.protocol+"//"+item.server+"/"+item.path);
                button.appendChild(img);
            }
        }

        var name=document.createElement("div");
        name.setAttribute("class","cloud-foto-item-name");
        if(item.tipo=="cartella")
        {
            name.setAttribute("id","cloudFotoItemName"+item.id_cartella);
        }
        if(item.tipo=="file")
        {
            name.setAttribute("id","cloudFotoItemName"+item.id_file);
        }
        if(item.tipo=="cartella")
        {
            name.innerHTML=item.cartella;
        }
        if(item.tipo=="file")
        {
            name.innerHTML=item.nomeFile;
        }
        button.appendChild(name);

        //outerContainer.appendChild(button);

        var date=document.createElement("div");
        date.setAttribute("class","cloud-foto-item-date");
        var dataOraString=item.dataOraString.replace(" ","<br>");
        dataOraString=dataOraString.split(".")[0];
        date.innerHTML=dataOraString;
        //outerContainer.appendChild(date);
        button.appendChild(date);

        outerContainer.appendChild(button);

        var actionButton=document.createElement("button");
        actionButton.setAttribute("class","cloud-foto-item-action-button");
        if(item.tipo=="cartella")
        {
            actionButton.setAttribute("id","cloudFotoItemActionButton"+item.id_cartella);
            actionButton.setAttribute("onclick","actionMenuCloudFoto(event,'"+item.tipo+"','"+item.cartella+"','"+item.descrizione+"',"+item.id_cartella+")");
        }
        if(item.tipo=="file")
        {
            actionButton.setAttribute("id","cloudFotoItemActionButton"+item.id_file);
            actionButton.setAttribute("onclick","actionMenuCloudFoto(event,'"+item.tipo+"','"+item.nomeFile+"','"+item.descrizione+"',"+item.id_file+")");
        }

        actionButton.innerHTML='<i class="fal fa-ellipsis-v"></i>';
        
        outerContainer.appendChild(actionButton);

        container.appendChild(outerContainer);

        i++;
    });
    filesLenght=i;
}
function removeCheckboxes()
{
    checkedFiles=[];
    var cloudFotoItemButtons=document.getElementsByClassName("cloud-foto-item-button");
    for (let index = 0; index < cloudFotoItemButtons.length; index++)
    {
        const cloudFotoItemButton = cloudFotoItemButtons[index];
        const cloudFotoItemOuterContainer = cloudFotoItemButton.parentElement;
        var number=cloudFotoItemOuterContainer.getAttribute("number");

        cloudFotoItemButton.removeAttribute("onclick");

        var tipo=cloudFotoItemButton.getAttribute("tipo");
        if(tipo=="cartella")
        {
            var id_cartella=cloudFotoItemButton.getAttribute("id_cartella");
            cloudFotoItemButton.setAttribute("onlongtouch","getCheckboxes("+number+")");
            cloudFotoItemButton.setAttribute("onclick","getElencoContenutoCartella('"+id_cartella+"')");
        }
        if(tipo=="file")
        {
            var nomeFile=cloudFotoItemButton.getAttribute("nomeFile");
            var formato=nomeFile.split(".")[nomeFile.split(".").length-1];
            cloudFotoItemButton.setAttribute("onlongtouch","getCheckboxes("+number+")");
            cloudFotoItemButton.setAttribute("onclick","expandImage('"+formato+"',this.firstChild,'"+nomeFile+"')");
        }

        cloudFotoItemButton.style.width="";

        document.getElementById("clouFotoItemCheckboxButtonContainer"+number).remove();
    }
    
    $(".select-files-button").remove();
    $("#bottomControlBarCloudFoto *").css("display","");
}
function selectAllCheckboxes(button)
{
    var checkbox=button.getElementsByTagName("i")[0];
    var className=checkbox.className;

    if(className=="fal fa-square")
    {       
        var checkboxContainers=document.getElementsByClassName("cloud-foto-item-checkbox-button-container");
        for (let index = 0; index < checkboxContainers.length; index++)
        {
            var checkboxContainers=document.getElementsByClassName("cloud-foto-item-checkbox-button-container");
            for (let index = 0; index < checkboxContainers.length; index++)
            {
                const checkboxContainer = checkboxContainers[index];
                var checked=checkboxContainer.getAttribute("checked");
                var number=checkboxContainer.getAttribute("number");
                if(checked=="false")
                    toggleCheckboxCloudFotoItem(number);
            }
        }
    }
    else
    {       
        var checkboxContainers=document.getElementsByClassName("cloud-foto-item-checkbox-button-container");
        for (let index = 0; index < checkboxContainers.length; index++)
        {
            const checkboxContainer = checkboxContainers[index];
            var checked=checkboxContainer.getAttribute("checked");
            var number=checkboxContainer.getAttribute("number");
            if(checked=="true")
                toggleCheckboxCloudFotoItem(number);
        }
    }
}
function deleteAllCheckedFiles()
{
    if(checkedFiles.length>0)
    {
        Swal.fire
        ({
            icon:"warning",
            title:"Vuoi eliminare tutti i file e le cartella selezionate?",
            confirmButtonText:"Conferma",
            confirmButtonColor:"#DA6969",
            showCancelButton:true,
            cancelButtonText:"Annulla",
            showCloseButton:true,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
        }).then((result) => async function ()
        {
            if (result.value)
            {
                var error=false;
                for (let index = 0; index < checkedFiles.length; index++) 
                {
                    const number = checkedFiles[index];
                    var cloudFotoItemOuterContainer=document.getElementById("cloudFotoItemOuterContainer"+number);
                    var tipo=cloudFotoItemOuterContainer.getAttribute("tipo");
                    var nome=cloudFotoItemOuterContainer.getAttribute("nome");
                    var id=cloudFotoItemOuterContainer.getAttribute("id_file_cartella");

                    var cartella=await getNomeCartellaCloudFoto(cartella_corrente);
                    var path=await getPath(cartella_corrente,cartella);
                    var pathString="";
                    path.forEach(function(item)
                    {
                        if(item.cartella!=null)
                            pathString+=item.cartella+"/";
                    });
                    if(tipo=="cartella")
                    {
                        var tabella="cartelle_cloud_foto";
                    }
                    if(tipo=="file")
                    {
                        var tabella="files_cloud_foto";
                    }
                    
                    var response=await eliminaFileCartellaCloudFotoAsync(id,tipo,pathString,nome);
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                        error=true;
                }
                if(error)
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                else
                    getElencoContenutoCartella(cartella_corrente);
            }
        });
    }
}
function eliminaFileCartellaCloudFotoAsync(id,tipo,pathString,nome)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("eliminaFileCartellaCloudFoto.php",
        {
            id,
            tipo,
            pathString,
            nome
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
            {
                resolve("error");
            }
        });
    });
}
function getCheckboxes()
{
    if(document.getElementsByClassName("cloud-foto-item-checkbox-button-container").length==0)
    {
        var bottomControlBarCloudFoto=document.getElementById("bottomControlBarCloudFoto");
        $("#bottomControlBarCloudFoto *").css("display","none");

        var btnAnnulla=document.createElement("button");
        btnAnnulla.setAttribute("class","bottom-control-bar-button select-files-button");
        btnAnnulla.setAttribute("onclick","removeCheckboxes()");
        btnAnnulla.setAttribute("style","width:25%;align-items:center;justify-content:center");
        var div=document.createElement("div");
        var i=document.createElement("i");
        i.setAttribute("class","fal fa-undo");
        div.appendChild(i);
        btnAnnulla.appendChild(div);
        var div=document.createElement("div");
        var span=document.createElement("span");
        span.innerHTML="Annulla";
        div.appendChild(span);
        btnAnnulla.appendChild(div);
        bottomControlBarCloudFoto.appendChild(btnAnnulla);

        var btnSelezionaTutti=document.createElement("button");
        btnSelezionaTutti.setAttribute("id","btnSelezionaTutti");
        btnSelezionaTutti.setAttribute("class","bottom-control-bar-button select-files-button");
        btnSelezionaTutti.setAttribute("onclick","selectAllCheckboxes(this)");
        btnSelezionaTutti.setAttribute("style","width:25%;align-items:center;justify-content:center");
        var div=document.createElement("div");
        var i=document.createElement("i");
        i.setAttribute("class","fal fa-square");
        i.setAttribute("style","font-size: 17px;");
        div.appendChild(i);
        btnSelezionaTutti.appendChild(div);
        var div=document.createElement("div");
        var span=document.createElement("span");
        span.innerHTML="Seleziona";
        div.appendChild(span);
        btnSelezionaTutti.appendChild(div);
        bottomControlBarCloudFoto.appendChild(btnSelezionaTutti);

        var btnScarica=document.createElement("button");
        btnScarica.setAttribute("class","bottom-control-bar-button select-files-button");
        btnScarica.setAttribute("onclick","console.log(checkedFiles)");
        btnScarica.setAttribute("style","width:25%;align-items:center;justify-content:center");
        var div=document.createElement("div");
        var i=document.createElement("i");
        i.setAttribute("class","fal fa-cloud-download");
        div.appendChild(i);
        btnScarica.appendChild(div);
        var div=document.createElement("div");
        var span=document.createElement("span");
        span.innerHTML="Scarica";
        div.appendChild(span);
        btnScarica.appendChild(div);
        bottomControlBarCloudFoto.appendChild(btnScarica);

        var btnElimina=document.createElement("button");
        btnElimina.setAttribute("class","bottom-control-bar-button select-files-button");
        btnElimina.setAttribute("onclick","deleteAllCheckedFiles()");
        btnElimina.setAttribute("style","width:25%;align-items:center;justify-content:center");
        var div=document.createElement("div");
        var i=document.createElement("i");
        i.setAttribute("class","fal fa-trash");
        div.appendChild(i);
        btnElimina.appendChild(div);
        var div=document.createElement("div");
        var span=document.createElement("span");
        span.innerHTML="Elimina";
        div.appendChild(span);
        btnElimina.appendChild(div);
        bottomControlBarCloudFoto.appendChild(btnElimina);

        var i=onlongtouchArguments[0];
        var cloudFotoItemButtons=document.getElementsByClassName("cloud-foto-item-button");
        for (let index = 0; index < cloudFotoItemButtons.length; index++)
        {
            const cloudFotoItemButton = cloudFotoItemButtons[index];
            const cloudFotoItemOuterContainer = cloudFotoItemButton.parentElement;
            var number=cloudFotoItemOuterContainer.getAttribute("number");

            cloudFotoItemButton.setAttribute("onclick","toggleCheckboxCloudFotoItem("+number+")");
    
            cloudFotoItemButton.style.width="calc(100% - 55px)";
    
            var checkboxContainer=document.createElement("button");
            checkboxContainer.setAttribute("class","cloud-foto-item-checkbox-button-container");
            checkboxContainer.setAttribute("number",number);
            checkboxContainer.setAttribute("id","clouFotoItemCheckboxButtonContainer"+number);
            checkboxContainer.setAttribute("checked","false");
            checkboxContainer.setAttribute("onclick","toggleCheckboxCloudFotoItem("+number+")");
    
            var checkbox=document.createElement("i");
            checkbox.setAttribute("class","fal fa-square");
    
            checkboxContainer.appendChild(checkbox);
    
            cloudFotoItemOuterContainer.insertBefore(checkboxContainer, cloudFotoItemOuterContainer.firstChild);
        }

        if(!isNaN(i))
        {
            toggleCheckboxCloudFotoItem(i);
        }
    }
}
function toggleCheckboxCloudFotoItem(number)
{
    var button=document.getElementById("clouFotoItemCheckboxButtonContainer"+number);
    var checkbox=button.getElementsByTagName("i")[0];
    var className=checkbox.className;

    if(className=="fal fa-square")
    {
        checkbox.className="fas fa-check-square";
        checkbox.style.color="rgb(48, 133, 214)";
        button.setAttribute("checked","true");
        checkedFiles.push(parseInt(number));
    }
    else
    {
        checkbox.className="fal fa-square";
        checkbox.style.color="black";
        button.setAttribute("checked","false");
        
        checkedFiles.splice(checkedFiles.indexOf(number), 1);
    }

    var button=document.getElementById("btnSelezionaTutti");
    var checkbox=button.getElementsByTagName("i")[0];
    var className=checkbox.className;
    if(filesLenght==checkedFiles.length)
    {
        checkbox.className="fas fa-check-square";
        checkbox.style.color="rgb(48, 133, 214)";
    }
    else
    {
        checkbox.className="fal fa-square";
        checkbox.style.color="black";
    }
}
function clickActionButton()
{
    var id=onlongtouchArguments[0];
    document.getElementById("cloudFotoItemActionButton"+id).click();
}
var requeryElencoContenutoCartella;
function actionMenuCloudFoto(event,tipo,nome,descrizione,id)
{
    requeryElencoContenutoCartella=true;
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-cloud-foto-outer-container");

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Nome "+tipo;
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("class","popup-cloud-foto-input");
    input.setAttribute("id","popupCloudFotoInputName");
    if(tipo=="cartella")
    {
        input.setAttribute("value",nome);
    }
    if(tipo=="file")
    {
        //var formato=nome.split(".")[1];
		var formato=nome.split(".")[nome.split(".").length-1];
        input.setAttribute("value",nome.replace("."+formato,""));
        input.setAttribute("formato",formato);
    }
    row.appendChild(input);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML="Descrizione";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-foto-ordini-row");
    row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    var textarea=document.createElement("textarea");
    textarea.setAttribute("class","popup-cloud-foto-textarea");
    textarea.setAttribute("id","popupCloudFotoTextareaDescrizione");
    if(descrizione!="null")
        textarea.innerHTML=descrizione;
    row.appendChild(textarea);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-cloud-foto-row");
    row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row");

    var rinominaButton=document.createElement("button");
    rinominaButton.setAttribute("class","popup-cloud-foto-button");
    rinominaButton.setAttribute("style","width:calc(50% - 5px);");
    rinominaButton.setAttribute("onclick","salvaModificheFileCartellaCloudFoto('"+tipo+"',"+id+")");
    rinominaButton.innerHTML='<span>Salva modifiche</span><i class="fas fa-save"></i>';
    row.appendChild(rinominaButton);

    var eliminaButton=document.createElement("button");
    eliminaButton.setAttribute("class","popup-cloud-foto-button");
    eliminaButton.setAttribute("style","width:calc(50% - 5px);");
    eliminaButton.setAttribute("onclick","eliminaFileCartellaCloudFoto('"+tipo+"',"+id+",'"+nome+"')");
    eliminaButton.innerHTML='<span>Elimina '+tipo+'</span><i class="fad fa-trash"></i>';
    row.appendChild(eliminaButton);

    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:"100%",
        background:"#404040",
        title:"Menù "+tipo+ "&nbsp<u><i>"+nome+"</i></u>",
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

                    $("textarea").keypress(function(event){
                        var ew = event.which;
                        if(ew == 32)
                            return true;
                        if(48 <= ew && ew <= 57)
                            return true;
                        if(65 <= ew && ew <= 90)
                            return true;
                        if(97 <= ew && ew <= 122)
                            return true;
                        return false;
                    });
                    $("input").keypress(function(event){
                        var ew = event.which;
                        if(ew == 32)
                            return true;
                        if(48 <= ew && ew <= 57)
                            return true;
                        if(65 <= ew && ew <= 90)
                            return true;
                        if(97 <= ew && ew <= 122)
                            return true;
                        return false;
                    });
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    }).then((result) => 
    {
        /*modificaInformazioniCloudFoto(tipo,id,'descrizione');
        if(requeryElencoContenutoCartella)
            getElencoContenutoCartella(cartella_corrente);*/
    });
}
async function salvaModificheFileCartellaCloudFoto(tipo,id)
{
    var cartella=await getNomeCartellaCloudFoto(cartella_corrente);
    var path=await getPath(cartella_corrente,cartella);
    var pathString="";
    path.forEach(function(item)
    {
        if(item.cartella!=null)
            pathString+=item.cartella+"/";
    });

    if(tipo=="cartella")
    {
        var tabella="cartelle_cloud_foto";
    }
    if(tipo=="file")
    {
        var tabella="files_cloud_foto";
    }
    var colonna="descrizione";
    var valore=document.getElementById("popupCloudFotoTextareaDescrizione").value;
    $.post("modificaInformazioniCloudFoto.php",
    {
        tabella,
        valore,
        colonna,
        id,
        tipo
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
                if(tipo=="cartella")
                {
                    var colonna="cartella";
                    var valore=document.getElementById("popupCloudFotoInputName").value;
                }
                if(tipo=="file")
                {
                    var colonna="nomeFile";
                    var valore=document.getElementById("popupCloudFotoInputName").value+"."+document.getElementById("popupCloudFotoInputName").getAttribute("formato");
                }
                $.post("modificaInformazioniCloudFoto.php",
                {
                    tabella,
                    valore,
                    colonna,
                    id,
                    tipo
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
                            var nameContainer=document.getElementById("cloudFotoItemName"+id);
                            var oldName=nameContainer.innerHTML;
                            var newName=valore;
                            $.post("rinominaFileCartellaCloudFoto.php",
                            {
                                oldName,
                                newName,
                                pathString
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
                                        //console.log("ok");
                                        Swal.close();
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
                    else
                    {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(status);
                    }
                });
            }
        }
        else
        {
            Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
            console.log(status);
        }
    });
}
async function eliminaFileCartellaCloudFoto(tipo,id,nome)
{
    var cartella=await getNomeCartellaCloudFoto(cartella_corrente);
    var path=await getPath(cartella_corrente,cartella);
    var pathString="";
    path.forEach(function(item)
    {
        if(item.cartella!=null)
            pathString+=item.cartella+"/";
    });
    if(tipo=="cartella")
    {
        var title="Vuoi eliminare la cartella e tutto il suo contenuto?";
        var tabella="cartelle_cloud_foto";
    }
    if(tipo=="file")
    {
        var title="Vuoi eliminare il file?";
        var tabella="files_cloud_foto";
    }
    Swal.fire
    ({
        icon:"warning",
        title,
        confirmButtonText:"Conferma",
        confirmButtonColor:"#DA6969",
        showCancelButton:true,
        cancelButtonText:"Annulla",
        showCloseButton:true,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}
    }).then((result) => 
    {
        if (result.value)
        {
            $.post("eliminaFileCartellaCloudFoto.php",
            {
                id,
                tipo,
                pathString,
                nome
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
                        //console.log("ok");
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
function expandImage(formato,element,nomeFile)
{
    if(formato.toLowerCase()=="mp4")
    {
        var src=element.getElementsByTagName("source")[0].getAttribute("src");
    }
    else
        var src=element.getAttribute("src");

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

    if(formato.toLowerCase()=="mp4")
    {
        var video=document.createElement("video");
        video.setAttribute("controls","controls");
        var source=document.createElement("source");
        source.setAttribute("src",src);
        source.setAttribute("type","video/mp4");
        video.appendChild(source);
        outerContainer.appendChild(video);
    }
    else
    {
        var img=document.createElement("img");
        img.setAttribute("src",src);
        outerContainer.appendChild(img);
    }

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
$("textarea").keypress(function(event){
    var ew = event.which;
    if(ew == 32)
        return true;
    if(48 <= ew && ew <= 57)
        return true;
    if(65 <= ew && ew <= 90)
        return true;
    if(97 <= ew && ew <= 122)
        return true;
    return false;
});
$("input").keypress(function(event){
    var ew = event.which;
    if(ew == 32)
        return true;
    if(48 <= ew && ew <= 57)
        return true;
    if(65 <= ew && ew <= 90)
        return true;
    if(97 <= ew && ew <= 122)
        return true;
    return false;
});
function searchCloudFoto(value)
{
    $(".cloud-foto-item-outer-container").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}
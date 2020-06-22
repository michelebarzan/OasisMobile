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

var itemClassOuterContainer;
var itemClassButton;
var itemClassName;
var itemClassDate;
var itemClassActionButton;
var itemClassCheckbox;

async function onloadcloudFoto()
{
    var checkCookieSettingsResponse=await checkCookieSettings();
    //if(checkCookieSettingsResponse)

    if(checkboxMostraImmaginiIngrandite)
    {
        itemClassOuterContainer="cloud-foto-large-item-outer-container";
        itemClassButton="cloud-foto-large-item-button";
        itemClassName="cloud-foto-large-item-name";
        itemClassDate="cloud-foto-large-item-date";
        itemClassActionButton="cloud-foto-large-item-action-button";
        itemClassCheckbox="cloud-foto-large-item-checkbox-button-container";

        document.getElementById("containerCloudFoto").className="container-cloud-foto-large-item";
    }
    else
    {
        itemClassOuterContainer="cloud-foto-item-outer-container";
        itemClassButton="cloud-foto-item-button";
        itemClassName="cloud-foto-item-name";
        itemClassDate="cloud-foto-item-date";
        itemClassActionButton="cloud-foto-item-action-button";
        itemClassCheckbox="cloud-foto-item-checkbox-button-container";

        document.getElementById("containerCloudFoto").className="container-cloud-foto-small-item";
    }

    getElencoContenutoCartella(1);
}
function getPath(id_cartella,cartella)
{
    return new Promise(function (resolve, reject) 
    {
        $.post("getPathCloudFoto.php",
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
    try {
        removeCheckboxes();
    } catch (error) {}

    filesLenght=0;

    var oldScrollTop=0;
    if(document.getElementById("containerCloudFoto")!=null)
    {
        oldScrollTop=document.getElementById("containerCloudFoto").scrollTop;
    }

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
        //console.log(item);

        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class",itemClassOuterContainer);
        outerContainer.setAttribute("id","cloudFotoItemOuterContainer"+i);
        outerContainer.setAttribute("number",i);

        outerContainer.setAttribute("tipo",item.tipo);
        outerContainer.setAttribute("server",item.server);

        if(i==array.length-1)
        {
            outerContainer.setAttribute("style","border-bottom:0.5px solid transparent");
        }

        var button=document.createElement("button");
        button.setAttribute("class",itemClassButton);
        button.setAttribute("number",i);
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
            button.setAttribute("onclick","expandImage("+i+",'"+formato+"',this.firstChild,'"+item.nomeFile+"')");
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
        if(!checkboxMostraImmaginiIngrandite)
        {
            var name=document.createElement("div");
            name.setAttribute("class",itemClassName);
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
        
            var date=document.createElement("div");
            date.setAttribute("class",itemClassDate);
            var dataOraString=item.dataOraString.replace(" ","<br>");
            dataOraString=dataOraString.split(".")[0];
            date.innerHTML=dataOraString;
            button.appendChild(date);
        }

        outerContainer.appendChild(button);

        var actionButton=document.createElement("button");
        actionButton.setAttribute("class",itemClassActionButton);
        var src=location.protocol+"//"+item.server+"/"+item.path;
        if(item.tipo=="cartella")
        {
            actionButton.setAttribute("id","cloudFotoItemActionButton"+item.id_cartella);
            actionButton.setAttribute("onclick","actionMenuCloudFoto(event,'"+item.tipo+"','"+item.cartella+"','"+item.descrizione+"',"+item.id_cartella+",'"+src+"','"+location.protocol+"','"+item.server+"','"+item.path+"')");
        }
        if(item.tipo=="file")
        {
            actionButton.setAttribute("id","cloudFotoItemActionButton"+item.id_file);
            actionButton.setAttribute("onclick","actionMenuCloudFoto(event,'"+item.tipo+"','"+item.nomeFile+"','"+item.descrizione+"',"+item.id_file+",'"+src+"','"+location.protocol+"','"+item.server+"','"+item.path+"')");
        }

        if(!checkboxMostraImmaginiIngrandite)
            actionButton.innerHTML='<i class="fal fa-ellipsis-v"></i>';
        else
        {
            var name=document.createElement("span");
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
            var icon=document.createElement("i");
            icon.setAttribute("class","fal fa-ellipsis-v");
            actionButton.appendChild(name);
            actionButton.appendChild(icon);
        }
        
        outerContainer.appendChild(actionButton);

        container.appendChild(outerContainer);

        i++;
    });
    filesLenght=i;

    if(checkboxMostraImmaginiIngrandite)
    {
        try {
            var width=document.getElementsByClassName(itemClassOuterContainer)[0].offsetWidth;
            $("."+itemClassOuterContainer).css("height",width+"px")
        } catch (error) {}
    }

    document.getElementById("containerCloudFoto").scrollTop = oldScrollTop;
}
function removeCheckboxes()
{
    checkedFiles=[];
    var cloudFotoItemButtons=document.getElementsByClassName(itemClassButton);
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
            cloudFotoItemButton.setAttribute("onclick","expandImage("+number+",'"+formato+"',this.firstChild,'"+nomeFile+"')");
        }

        cloudFotoItemButton.style.width="";

        document.getElementById("clouFotoItemCheckboxButtonContainer"+number).remove();

        if(checkboxMostraImmaginiIngrandite)
            cloudFotoItemButton.style.display="";
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
        var checkboxContainers=document.getElementsByClassName(itemClassCheckbox);
        for (let index = 0; index < checkboxContainers.length; index++)
        {
            var checkboxContainers=document.getElementsByClassName(itemClassCheckbox);
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
        var checkboxContainers=document.getElementsByClassName(itemClassCheckbox);
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
function getPopupDeleteAllCheckedFiles()
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
        }).then((result) => 
        {
            if (result.value)
            {
                deleteAllCheckedFiles();
            }
        });
    }
}
async function deleteAllCheckedFiles()
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
		
		var response=await eliminaFileCartellaCloudFotoAsync(id,tipo,pathString,nome);
		if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
			error=true;
	}
	removeCheckboxes();
	if(error)
		Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
	else
		getElencoContenutoCartella(cartella_corrente);
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
				console.log(response);
                resolve(response);
            }
            else
            {
                resolve("error");
            }
        });
    });
}
async function downloadAllCheckedFiles()
{
    Swal.fire
    ({
        title: "Caricamento in corso... ",
        background:"rgba(0,0,0,0.4)",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function()
        {
            document.getElementsByClassName("swal2-title")[0].style.color="white";
            document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
            document.getElementsByClassName("swal2-container")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.height="100%";
        }
    });

    var filesToDownload=[];

    var protocol=location.protocol;
    var cartella=await getNomeCartellaCloudFoto(cartella_corrente);
    var path=await getPath(cartella_corrente,cartella);
    var pathString="";
    path.forEach(function(item)
    {
        if(item.cartella!=null)
            pathString+=item.cartella+"/";
    });
    var id_utente=await getSessionValue("id_utente");

    var thereIsAFolder=false;

	for (let index = 0; index < checkedFiles.length; index++) 
	{
		const number = checkedFiles[index];
		var cloudFotoItemOuterContainer=document.getElementById("cloudFotoItemOuterContainer"+number);
        var tipo=cloudFotoItemOuterContainer.getAttribute("tipo");
        if(tipo=="cartella")
            thereIsAFolder=true;
        var nome=cloudFotoItemOuterContainer.getAttribute("nome");
        var server=cloudFotoItemOuterContainer.getAttribute("server");
		
        var src=protocol+"//"+server+"/"+pathString;
        
        var fileToDownload=
        {
            nome,
            tipo,
            path:pathString,
            src
        };
        
        filesToDownload.push(fileToDownload);
	}
    
    var JSONfilesToDownload=JSON.stringify(filesToDownload);

    $.post("downloadAllCheckedFilesCloudFoto.php",
    {
        JSONfilesToDownload,
        cartella,
        id_utente
    },
    function(response, status)
    {
        if(status=="success")
        {
            removeCheckboxes();
            Swal.close();
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                try {
                    document.getElementById("downloadCartellaLink").remove();
                } catch (error) {}

                var iframe=document.createElement("iframe");
                iframe.setAttribute("id","downloadCartellaLink");
                iframe.setAttribute("style","display:none");

                document.body.appendChild(iframe);
                document.getElementById('downloadCartellaLink').src = "files/cloudFoto/"+cartella+"_"+id_utente+".rar";

                if(thereIsAFolder)
                {
                    if(checkboxShowAlertRar)
                    {
                        setCookie("checkboxShowAlertRar","false");
                        checkboxShowAlertRar=false;

                        if(isIos())
                        {
                            var link=document.createElement("a");
                            link.setAttribute("href","https://apps.apple.com/it/app/izip-zip-unzip-unrar-tool/id413971331");
                            link.setAttribute("style","font-family:'Quicksand', sans-serif;color:#4C91CB;font-size:14px;margin-bottom:20px;display:block;margin-top:10px");
                            link.setAttribute("target","_blank");
                            link.innerHTML="Applicazione consigliata: iZip";
                        }
                        else
                        {
                            var link=document.createElement("a");
                            link.setAttribute("href","https://play.google.com/store/apps/details?id=com.rarlab.rar&hl=it");
                            link.setAttribute("style","font-family:'Quicksand', sans-serif;color:#4C91CB;font-size:14px;margin-bottom:20px;display:block;margin-top:10px");
                            link.setAttribute("target","_blank");
                            link.innerHTML="Applicazione consigliata: RAR";
                        }

                        Swal.fire
                        ({
                            icon:"info",
                            title: "Il file scaricato o alcuni dei file scaricati sono archivi rar. Per visualizzarli avrai bisogno di un applicazione di terze parti.",
                            width:"100%",
                            background:"#404040",
                            onOpen : function()
                                    {
                                        document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                                        document.getElementsByClassName("swal2-title")[0].style.paddingLeft="10px";
                                        document.getElementsByClassName("swal2-title")[0].style.paddingRight="10px";
                                        document.getElementsByClassName("swal2-popup")[0].style.borderRadius="4px";
                                        document.getElementsByClassName("swal2-close")[0].style.outline="none";
                                    },
                            showCloseButton:true,
                            showConfirmButton:false,
                            showCancelButton:false,
                            html:link.outerHTML
                        });
                    }
                }
            }
        }
    });
}
function getCheckboxes()
{
    checkedFiles=[];
    if(document.getElementsByClassName(itemClassCheckbox).length==0)
    {
        getSystemToast("<span>Clicca su un elemento per selezionarlo</span>");
        setTimeout(function(){ removeSystemToast(); }, 5000);

        var bottomControlBarCloudFoto=document.getElementById("bottomControlBarCloudFoto");
        $("#bottomControlBarCloudFoto *").css("display","none");

        var btnElimina=document.createElement("button");
        btnElimina.setAttribute("class","bottom-control-bar-button select-files-button");
        btnElimina.setAttribute("onclick","getPopupDeleteAllCheckedFiles()");
        btnElimina.setAttribute("style","width:20%;align-items:center;justify-content:center");
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

        var btnScarica=document.createElement("button");
        btnScarica.setAttribute("class","bottom-control-bar-button select-files-button");
        btnScarica.setAttribute("onclick","downloadAllCheckedFiles()");
        btnScarica.setAttribute("style","width:20%;align-items:center;justify-content:center");
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

        var btnCondividi=document.createElement("button");
        btnCondividi.setAttribute("class","bottom-control-bar-button select-files-button");
        btnCondividi.setAttribute("onclick","shareAllCheckedFiles()");
        btnCondividi.setAttribute("style","width:20%;align-items:center;justify-content:center");
        var div=document.createElement("div");
        var i=document.createElement("i");
        i.setAttribute("class","fal fa-share-alt");
        div.appendChild(i);
        btnCondividi.appendChild(div);
        var div=document.createElement("div");
        var span=document.createElement("span");
        span.innerHTML="Condividi";
        div.appendChild(span);
        btnCondividi.appendChild(div);
        bottomControlBarCloudFoto.appendChild(btnCondividi);

        var btnSelezionaTutti=document.createElement("button");
        btnSelezionaTutti.setAttribute("id","btnSelezionaTutti");
        btnSelezionaTutti.setAttribute("class","bottom-control-bar-button select-files-button");
        btnSelezionaTutti.setAttribute("onclick","selectAllCheckboxes(this)");
        btnSelezionaTutti.setAttribute("style","width:20%;align-items:center;justify-content:center");
        var div=document.createElement("div");
        var i=document.createElement("i");
        i.setAttribute("class","fal fa-square");
        i.setAttribute("style","font-size: 17px;");
        div.appendChild(i);
        btnSelezionaTutti.appendChild(div);
        var div=document.createElement("div");
        var span=document.createElement("span");
        span.innerHTML="Seleziona <b id='checkedFilesLabel'>0</b>/<b>"+filesLenght+"</b>";
        div.appendChild(span);
        btnSelezionaTutti.appendChild(div);
        bottomControlBarCloudFoto.appendChild(btnSelezionaTutti);

        var btnAnnulla=document.createElement("button");
        btnAnnulla.setAttribute("class","bottom-control-bar-button select-files-button");
        btnAnnulla.setAttribute("onclick","removeCheckboxes()");
        btnAnnulla.setAttribute("style","width:20%;align-items:center;justify-content:center");
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

        var i=onlongtouchArguments[0];
        var cloudFotoItemButtons=document.getElementsByClassName(itemClassButton);
        for (let index = 0; index < cloudFotoItemButtons.length; index++)
        {
            const cloudFotoItemButton = cloudFotoItemButtons[index];
            const cloudFotoItemOuterContainer = cloudFotoItemButton.parentElement;

            var number=cloudFotoItemOuterContainer.getAttribute("number");
            var nome=cloudFotoItemOuterContainer.getAttribute("nome");
            var tipo=cloudFotoItemButton.getAttribute("tipo");

            cloudFotoItemButton.setAttribute("onclick","toggleCheckboxCloudFotoItem("+number+")");
    
            cloudFotoItemButton.style.width="calc(100% - 55px)";
    
            var checkboxContainer=document.createElement("button");
            checkboxContainer.setAttribute("class",itemClassCheckbox);
            checkboxContainer.setAttribute("number",number);
            checkboxContainer.setAttribute("id","clouFotoItemCheckboxButtonContainer"+number);
            checkboxContainer.setAttribute("checked","false");
            checkboxContainer.setAttribute("onclick","toggleCheckboxCloudFotoItem("+number+")");
    
            var checkbox=document.createElement("i");
            checkbox.setAttribute("class","fal fa-square");
    
            checkboxContainer.appendChild(checkbox);

            if(checkboxMostraImmaginiIngrandite)
            {
                if(tipo=="cartella")
                {
                    checkboxContainer.setAttribute("style","background-image: url('./images/folder.png');background-repeat:no-repeat");
                }
                else
                {
                    var formato=nome.split(".")[nome.split(".").length-1];
                    if(formato.toLowerCase()=="mp4")
                    {
                        checkboxContainer.setAttribute("style","background-image: url('./images/video_player.png');background-repeat:no-repeat");
                    }
                    else
                    {
                        var img=cloudFotoItemButton.firstChild;
                        var src=img.getAttribute("src");
                        checkboxContainer.setAttribute("style","background-image:url('"+src+"')");
                    }
                }
                cloudFotoItemButton.style.display="none";
            }
            cloudFotoItemOuterContainer.insertBefore(checkboxContainer, cloudFotoItemOuterContainer.firstChild);
        }

        if(!isNaN(i))
        {
            try {
                toggleCheckboxCloudFotoItem(i);
            } catch (error) {
                removeCheckboxes();
                getCheckboxes();
            }
        }
    }
}
function shareAllCheckedFiles()
{

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
    document.getElementById("checkedFilesLabel").innerHTML=checkedFiles.length;
}
function clickActionButton()
{
    var id=onlongtouchArguments[0];
    document.getElementById("cloudFotoItemActionButton"+id).click();
}
var requeryElencoContenutoCartella;
function actionMenuCloudFoto(event,tipo,nome,descrizione,id,src,protocol,server,path)
{
    requeryElencoContenutoCartella=true;
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-cloud-foto-outer-container");

    var actionBar=document.createElement("div");
    actionBar.setAttribute("class","popup-expand-image-action-bar");
    actionBar.setAttribute("style","padding:0px;margin-bottom:10px;height:auto");

    var span=document.createElement("span");
    span.innerHTML="Menù "+tipo+ "&nbsp<u><i>"+nome+"</i></u>";
    actionBar.appendChild(span);

    var button=document.createElement("button");
    button.setAttribute("style","font-size:14px;margin-right:10px");
    button.setAttribute("class","popup-expand-image-action-bar-share-button");
    button.setAttribute("onclick","condividiFotoCartella('"+src+"','"+nome+"','"+tipo+"','"+protocol+"','"+server+"','"+path+"',"+id+")");
    button.innerHTML='<i class="fal fa-share-alt"></i>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("style","font-size:14px");
    button.setAttribute("class","popup-expand-image-action-bar-download-button");
    
    if(tipo=="cartella")
    {
        button.setAttribute("onclick","downloadCartella('"+src+"','"+nome+"','"+protocol+"','"+server+"','"+path+"')");
    }
    if(tipo=="file")
    {
        button.setAttribute("onclick","downloadFoto('"+src+"')");
    }
    button.innerHTML='<i class="fal fa-cloud-download"></i>';
    actionBar.appendChild(button);

    var button=document.createElement("button");
    button.setAttribute("style","margin-left:10px;font-size:18px");
    button.setAttribute("class","popup-expand-image-action-bar-close-button");
    button.setAttribute("onclick","Swal.close()");
    button.innerHTML='<i class="fal fa-times"></i>';
    actionBar.appendChild(button);

    outerContainer.appendChild(actionBar);

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
        //title:"Menù "+tipo+ "&nbsp<u><i>"+nome+"</i></u>",
        onOpen : function()
                {
                    /*document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
                    document.getElementsByClassName("swal2-title")[0].style.maxWidth="70%";
                    document.getElementsByClassName("swal2-title")[0].style.boxSizing="border-box";
                    document.getElementsByClassName("swal2-title")[0].style.marginLeft="10px";
                    document.getElementsByClassName("swal2-title")[0].style.marginTop="15px";
                    document.getElementsByClassName("swal2-title")[0].style.marginRight="10px";
                    document.getElementsByClassName("swal2-title")[0].style.whiteSpace="nowrap";
                    document.getElementsByClassName("swal2-title")[0].style.overflow="hidden";
                    document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";*/
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
        //showCloseButton:true,
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
function condividiFotoCartella(src,nome,tipo,protocol,server,path,id)
{
    var files=[];
    if(tipo=="cartella")
    {
        //files=
    }
    else
        files=[path];

    src = protocol+"/"+server+"/OasisMobile/shareCloudFoto.php?tipo="+tipo+"&path="+path+"&nome="+nome+"&id_cartella="+id+"&files="+files;

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","share-popup-outer-container");

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:10px;");

    var subjectEncoded = encodeURIComponent(nome);
    var bodyEncoded = encodeURIComponent(src);

    var buttonScegliDocumento=document.createElement("a");
    buttonScegliDocumento.setAttribute("href","mailto:?subject="+subjectEncoded+"&body=" + bodyEncoded);
    buttonScegliDocumento.setAttribute("class","share-popup-button");
    buttonScegliDocumento.setAttribute("style","width:100%;text-decoration:none");
    buttonScegliDocumento.innerHTML='<span>Invia mail</span><i class="fal fa-envelope"></i>';
    
    row.appendChild(buttonScegliDocumento);

    outerContainer.appendChild(row);

    var row=document.createElement("div");
    
    row.setAttribute("style","width:100%;margin-bottom:10px;");

    var buttonScegliDocumento=document.createElement("a");
    buttonScegliDocumento.setAttribute("href","https://api.whatsapp.com/send?text="+bodyEncoded);
    buttonScegliDocumento.setAttribute("class","share-popup-button");
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
    input.setAttribute("class","share-popup-input");
    input.innerHTML=src;
    
    row.appendChild(input);

    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:"100%",
        background:"#404040",
        title:"Condividi "+tipo,
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
        $.post("getNomeCartellaCloudFoto.php",
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
function expandImage(number,formato,element,nomeFile)
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
    button.setAttribute("style","font-size:14px;margin-right:10px");
    button.setAttribute("class","popup-expand-image-action-bar-share-button");
    button.setAttribute("onclick","condividiFotoCartella('"+src+"','"+nomeFile+"','file')");
    button.innerHTML='<i class="fal fa-share-alt"></i>';
    actionBar.appendChild(button);

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

    var innerContainer=document.createElement("div");
    innerContainer.setAttribute("class","popup-expand-image-inner-container");

    var button=document.createElement("button");
    button.setAttribute("onclick","getPreviousImage("+number+")");
    button.setAttribute("class","popup-expand-image-gallery-button");
    button.innerHTML='<i class="fad fa-chevron-double-left"></i>';
    innerContainer.appendChild(button);

    if(formato.toLowerCase()=="mp4")
    {
        var video=document.createElement("video");
        video.setAttribute("controls","controls");
        var source=document.createElement("source");
        source.setAttribute("src",src);
        source.setAttribute("type","video/mp4");
        video.appendChild(source);
        innerContainer.appendChild(video);
    }
    else
    {
        var img=document.createElement("img");
        img.setAttribute("src",src);
        innerContainer.appendChild(img);
    }

    var button=document.createElement("button");
    button.setAttribute("onclick","getNextImage("+number+")");
    button.setAttribute("class","popup-expand-image-gallery-button");
    button.innerHTML='<i class="fad fa-chevron-double-right"></i>';
    innerContainer.appendChild(button);

    outerContainer.appendChild(innerContainer);

    Swal.fire(
    {
        //position:"top",
        width:"100%",
        background:"#292929",
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
function getPreviousImage(number)
{
    var previousNumber=number-1;
    var cloudFotoItemOuterContainer=document.getElementById("cloudFotoItemOuterContainer"+previousNumber);
    if(cloudFotoItemOuterContainer!=null)
    {
        var tipo=cloudFotoItemOuterContainer.getAttribute("tipo");
        if(tipo=="cartella")
            getPreviousImage(previousNumber);
        else
        {
            var element=cloudFotoItemOuterContainer.firstChild.firstChild;
            var cloudFotoItemButton=cloudFotoItemOuterContainer.firstChild;

            var nomeFile=cloudFotoItemButton.getAttribute("nomeFile");
            var formato=nomeFile.split(".")[nomeFile.split(".").length-1];

            expandImage(previousNumber,formato,element,nomeFile);
        }
    }
}
function getNextImage(number)
{
    var nextNumber=number+1;
    var cloudFotoItemOuterContainer=document.getElementById("cloudFotoItemOuterContainer"+nextNumber);
    if(cloudFotoItemOuterContainer!=null)
    {
        var tipo=cloudFotoItemOuterContainer.getAttribute("tipo");
        if(tipo=="cartella")
            getNextImage(nextNumber);
        else
        {
            var element=cloudFotoItemOuterContainer.firstChild.firstChild;
            var cloudFotoItemButton=cloudFotoItemOuterContainer.firstChild;

            var nomeFile=cloudFotoItemButton.getAttribute("nomeFile");
            var formato=nomeFile.split(".")[nomeFile.split(".").length-1];

            expandImage(nextNumber,formato,element,nomeFile);
        }
    }
}
function downloadFoto(src)
{
    /*Swal.fire
    ({
        title: "Caricamento in corso... ",
        background:"rgba(0,0,0,0.4)",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function()
        {
            document.getElementsByClassName("swal2-title")[0].style.color="white";
            document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
            document.getElementsByClassName("swal2-container")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.height="100%";
        }
    });
    try {
        document.getElementById("downloadFileLink").remove();
    } catch (error) {}

    var link=document.createElement("a");
    link.setAttribute("id","downloadFileLink");
    link.setAttribute("href",src);
    link.setAttribute("download","download");
    link.setAttribute("style","display:none");

    document.body.appendChild(link);
    document.getElementById('downloadFileLink').click();
    Swal.close();*/
    window.open("downloadCloudFoto.php?src="+src);
}
function downloadCartella(src,nome,protocol,server,path)
{
    Swal.fire
    ({
        title: "Caricamento in corso... ",
        background:"rgba(0,0,0,0.4)",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function()
        {
            document.getElementsByClassName("swal2-title")[0].style.color="white";
            document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
            document.getElementsByClassName("swal2-container")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.height="100%";
        }
    });
    $.get("downloadCartellaCloudFoto.php",
    {
        src,
        nome,
        protocol,
        server,
        path
    },
    function(response, status)
    {
        if(status=="success")
        {
            Swal.close();
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
            {
                try {
                    document.getElementById("downloadCartellaLink").remove();
                } catch (error) {}

                var iframe=document.createElement("iframe");
                iframe.setAttribute("id","downloadCartellaLink");
                iframe.setAttribute("style","display:none");

                document.body.appendChild(iframe);
                document.getElementById('downloadCartellaLink').src = "files/cloudFoto/"+nome+".rar";

                if(checkboxShowAlertRar)
                {
                    setCookie("checkboxShowAlertRar","false");
                    checkboxShowAlertRar=false;

                    if(isIos())
                    {
                        var link=document.createElement("a");
                        link.setAttribute("href","https://apps.apple.com/it/app/izip-zip-unzip-unrar-tool/id413971331");
                        link.setAttribute("style","font-family:'Quicksand', sans-serif;color:#4C91CB;font-size:14px;margin-bottom:20px;display:block;margin-top:10px");
                        link.setAttribute("target","_blank");
                        link.innerHTML="Applicazione consigliata: iZip";
                    }
                    else
                    {
                        var link=document.createElement("a");
                        link.setAttribute("href","https://play.google.com/store/apps/details?id=com.rarlab.rar&hl=it");
                        link.setAttribute("style","font-family:'Quicksand', sans-serif;color:#4C91CB;font-size:14px;margin-bottom:20px;display:block;margin-top:10px");
                        link.setAttribute("target","_blank");
                        link.innerHTML="Applicazione consigliata: RAR";
                    }

                    Swal.fire
                    ({
                        icon:"info",
                        title: "Il file scaricato o alcuni dei file scaricati sono archivi rar. Per visualizzarli avrai bisogno di un applicazione di terze parti.",
                        width:"100%",
                        background:"#404040",
                        onOpen : function()
                                {
                                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                                    document.getElementsByClassName("swal2-title")[0].style.paddingLeft="10px";
                                    document.getElementsByClassName("swal2-title")[0].style.paddingRight="10px";
                                    document.getElementsByClassName("swal2-popup")[0].style.borderRadius="4px";
                                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                                },
                        showCloseButton:true,
                        showConfirmButton:false,
                        showCancelButton:false,
                        html:link.outerHTML
                    });
                }
            }
        }
    });
    //window.open("downloadCartellaCloudFoto.php?src="+src+"&nome="+nome+"&protocol="+protocol+"&server="+server+"&path="+path);
}
function nuovaCarella()
{
    var container=document.getElementById("containerCloudFoto");

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class",itemClassOuterContainer);

    var button=document.createElement("button");
    button.setAttribute("class",itemClassButton);
    //button.setAttribute("onclick","getElencoContenutoCartella('"+item.id_cartella+"')");

    var icon=document.createElement("i");
    icon.setAttribute("class","fas fa-folder");
    button.appendChild(icon);

    var name=document.createElement("div");
    name.setAttribute("class",itemClassName);

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
    date.setAttribute("class",itemClassDate);
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
    $("."+itemClassOuterContainer).filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}

var checkboxMostraImmaginiIngrandite;
var checkboxShowAlertRar;

function getPopupImpostazioni()
{
    var table=document.createElement("table");
    table.setAttribute("class","material-design-table-dark");

    //tbody
    var tbody = table.createTBody();

    //Mostra immagini ingrandite
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var labelMostraImmaginiIngrandite=document.createElement("label");
    labelMostraImmaginiIngrandite.setAttribute("class","pure-material-checkbox");

    var inputMostraImmaginiIngrandite=document.createElement("input");
    inputMostraImmaginiIngrandite.setAttribute("type","checkbox");
    if(checkboxMostraImmaginiIngrandite)
        inputMostraImmaginiIngrandite.setAttribute("checked","checked");
    inputMostraImmaginiIngrandite.setAttribute("id","checkboxMostraImmaginiIngrandite");
    inputMostraImmaginiIngrandite.setAttribute("onchange","checkboxMostraImmaginiIngrandite=this.checked;setCookie('checkboxMostraImmaginiIngrandite',this.checked);Swal.close();gotopath('cloudFoto');");
    labelMostraImmaginiIngrandite.appendChild(inputMostraImmaginiIngrandite);

    var spanMostraImmaginiIngrandite=document.createElement("span");
    spanMostraImmaginiIngrandite.setAttribute("style","color:white");
    spanMostraImmaginiIngrandite.innerHTML="<div style=' white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>Visualizzazione galleria</div>";
    labelMostraImmaginiIngrandite.appendChild(spanMostraImmaginiIngrandite);

    cell1.appendChild(labelMostraImmaginiIngrandite);

    //Ripristina impostazioni predefinite
    var row = tbody.insertRow(-1);

    var cell1 = row.insertCell(0);

    var buttonRipristinaImpostazioniPredefinite=document.createElement("button");
    buttonRipristinaImpostazioniPredefinite.setAttribute("class","material-design-table-dark-button-reset-settings");
    buttonRipristinaImpostazioniPredefinite.setAttribute("onclick","ripristinaImpostazioniPredefinite()");
    buttonRipristinaImpostazioniPredefinite.innerHTML="Ripristina impostazioni predefinite<i style='margin-left:5px' class='fad fa-repeat-alt'></i>";

    cell1.appendChild(buttonRipristinaImpostazioniPredefinite);
    //------------------------------------------------------------------------------------
    Swal.fire
    ({
        title: 'Impostazioni richieste',
        background: '#404040',
        position:"top",
        width:"100%",
        html: table.outerHTML,
        showCloseButton: true,
        showConfirmButton:false,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.color="#ddd";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                }
    }).then((result) => 
    {
        if (result.value)
        {
            
        }
    });
}
function ripristinaImpostazioniPredefinite()
{
    Swal.close();
    
    setCookie('checkboxShowAlertRar',"");
    setCookie('checkboxMostraImmaginiIngrandite',"");

    gotopath("cloudFoto");
}
async function checkCookieSettings()
{
    return new Promise(async function (resolve) 
    {
        var coockieCheckboxShowAlertRar=await getCookie("checkboxShowAlertRar");
        if(coockieCheckboxShowAlertRar=="")
            checkboxShowAlertRar=true;
        if(coockieCheckboxShowAlertRar.indexOf("true")>-1)
            checkboxShowAlertRar=true;
        if(coockieCheckboxShowAlertRar.indexOf("false")>-1)
            checkboxShowAlertRar=false;
        
        var coockiecheckboxMostraImmaginiIngrandite=await getCookie("checkboxMostraImmaginiIngrandite");
        if(coockiecheckboxMostraImmaginiIngrandite=="")
            checkboxMostraImmaginiIngrandite=false;
        if(coockiecheckboxMostraImmaginiIngrandite.indexOf("true")>-1)
            checkboxMostraImmaginiIngrandite=true;
        if(coockiecheckboxMostraImmaginiIngrandite.indexOf("false")>-1)
            checkboxMostraImmaginiIngrandite=false;
        
        resolve(true);
    });
}
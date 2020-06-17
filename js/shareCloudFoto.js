var cartella_corrente;

window.addEventListener("load", function(event) 
{
    getCartella();
});
async function getCartella()
{
    var nome=document.getElementById("hiddenNome").value;
    var path=document.getElementById("hiddenPath").value;
    var id_cartella=document.getElementById("hiddenId_cartella").value;

    console.log(nome);
    console.log(path);
    console.log(id_cartella);

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","share-cloud-foto-outer-container");

    var titleContainer=document.createElement("div");
    titleContainer.setAttribute("class","share-cloud-foto-title-container");
    titleContainer.innerHTML=nome;
    outerContainer.appendChild(titleContainer);

    var innerContainer=document.createElement("div");
    innerContainer.setAttribute("class","share-cloud-foto-inner-container");

    cartella_corrente=parseInt(id_cartella);

    var cartella=await getNomeCartellaCloudFoto(id_cartella);
    
    var path=await getPath(id_cartella,cartella);

    var cartelle=await getCartelle(id_cartella);
    var files=await getFiles(id_cartella);

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

    let i=0;
    array.forEach(function(item)
    {
        if(item.tipo=="file")
        {
            var formato=item.nomeFile.split(".")[item.nomeFile.split(".").length-1];
        
            if(formato.toLowerCase()=="mp4")
            {
                var video=document.createElement("video");
                var source=document.createElement("source");
                source.setAttribute("src",location.protocol+"//"+item.server+"/"+item.path);
                source.setAttribute("type","video/mp4");
                video.appendChild(source);
                innerContainer.appendChild(video);
            }
            else
            {
                var img=document.createElement("img");
                img.setAttribute("src",location.protocol+"//"+item.server+"/"+item.path);
                innerContainer.appendChild(img);
            }
        }

        i++;
    });

    outerContainer.appendChild(innerContainer);

    document.body.appendChild(outerContainer);

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
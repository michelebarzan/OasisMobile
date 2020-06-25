var cartella_corrente;

window.addEventListener("load", function(event) 
{
    getCartella();
});
async function getCartella()
{
    var files=[];
    files=await getFilesShareCloudFoto(id_share);
    console.log(files);

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","share-cloud-foto-outer-container");

    var titleContainer=document.createElement("div");
    titleContainer.setAttribute("class","share-cloud-foto-title-container");
    titleContainer.innerHTML="<a href='http://remote.oasisgroup.it/OasisMobile/index.html' style='color:rgb(48, 133, 214)'>Accedi all' applicazione</a>";
    outerContainer.appendChild(titleContainer);

    var innerContainer=document.createElement("div");
    innerContainer.setAttribute("class","share-cloud-foto-inner-container");

    files.forEach(function(item)
    {
        if(item.formato.toLowerCase()=="mp4")
        {
            var video=document.createElement("video");
            var source=document.createElement("source");
            source.setAttribute("src",item.src);
            source.setAttribute("type","video/mp4");
            video.appendChild(source);
            innerContainer.appendChild(video);
        }
        else
        {
            var img=document.createElement("img");
            img.setAttribute("src",item.src);
            innerContainer.appendChild(img);
        }
    });

    outerContainer.appendChild(innerContainer);

    document.body.appendChild(outerContainer);
}
function getFilesShareCloudFoto(id_share)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getFilesShareCloudFoto.php",
        {
            id_share
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
                        resolve([]);
                    }
                }
            }
            else
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                resolve([]);
            }
        });
    });
}
/*function getNomeCartellaCloudFoto(id_cartella)
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
}*/
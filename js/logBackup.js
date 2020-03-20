var nomePagina="Log Backup";
var pageInfo=
{
    pagina:"logBackup.html",
    nomePagina:"Log Backup",
    id_pagina:"1040",
    fileName:"logBackup"
};

function onloadlogBackup()
{
    getRegistroBackup();
}
function getRegistroBackup()
{
    $.get("getRegistroBackup.php",
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("#|error|#")>-1)
            {
                Swal.fire
                ({
                    icon: 'error',
                    title: "Errore. Se il problema persiste contatta l' amministratore"
                });
                console.log(response);
            }
            else
            {
                var titleContainer=document.getElementById("registroBackupTitleContainer");
                var container=document.getElementById("registroBackupInnerContainer");
                var arrayResponse=JSON.parse(response);
                titleContainer.innerHTML='<span>'+arrayResponse.nomeFile+'</span><span style="margin-left:auto">'+arrayResponse.dataModifica+'</span>';
                var contenutoFile=arrayResponse.contenutoFile;
                contenutoFile.reverse();
                container.innerHTML="<div>"+contenutoFile.join("</div><div>")+"</div>";
            }
        }
        else
            reject({status});
    });
}
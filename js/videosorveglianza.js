var nomePagina="Video Sorveglianza";
var pageInfo=
{
    pagina:"videosorveglianza.html",
    nomePagina:"Video Sorveglianza",
    id_pagina:"1054",
    fileName:"videosorveglianza"
};

async function onloadvideosorveglianza()
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="12px"}
    });

    var iframe = document.createElement("iframe");
    iframe.setAttribute("src","https://www.ispyconnect.com/app/");
    iframe.setAttribute("id","videosorveglianzaiFrame");
    iframe.setAttribute("onload","setTimeout(() => {Swal.close();document.getElementById('videosorveglianzaiFrame').style.display='block'}, 2000);");
    document.getElementById("pageContainer").appendChild(iframe);
}
var nomePagina="Scarico Magazzino";
var pageInfo=
{
    pagina:"scaricoMagazzino.html",
    nomePagina:"Scarico Magazzino",
    id_pagina:"1056",
    fileName:"scaricoMagazzino"
};
var id_utente;
var selectedButton = "";
var App;

async function onloadscaricoMagazzino()
{
    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-2x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    location.href = "https://webapp.oasisbagni.it/";

    Swal.close();
}
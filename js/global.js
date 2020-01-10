function setCookie(name,value)
{
    $.post("setCookie.php",{name,value},
    function(response, status)
    {
        if(status!="success")
            console.log(status);
    });
}
function getCookie(name)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getCookie.php",{name},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                reject({status});
        });
    });
}
function getSessionValue(name)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getSessionValue.php",{name},
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                reject({status});
        });
    });
}
function setSessionValue(name,value)
{

}
function addTopButton()
{
    var button=document.createElement("button");
    button.setAttribute("id","btnGoToTop");
    button.setAttribute("onclick","goToTop()");
    button.innerHTML='<i class="fal fa-arrow-alt-to-top"></i>';

    document.body.appendChild(button);

    window.onscroll = function() {scrollFunction()};
}
function scrollFunction() 
{
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    $("#btnGoToTop").show("fast","swing");
    $("#btnGoToTop").css("display","flex");
  } else {
    $("#btnGoToTop").hide("fast","swing");
  }
}
function goToTop() 
{
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
window.addEventListener("load", function(event)
{
    var alert=document.createElement("div");
    alert.setAttribute("id","alertOrientation");
    alert.innerHTML="Dispositivo o modalità di visualizzazione non supportata<br>Contatta l' amministratore";

    document.documentElement.appendChild(alert);
});


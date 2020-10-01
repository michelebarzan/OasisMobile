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
window.addEventListener("load", async function(event)
{
    var alert=document.createElement("div");
    alert.setAttribute("id","alertOrientation");
    alert.innerHTML="Dispositivo o modalità di visualizzazione non supportata<br>Contatta l' amministratore";

    document.documentElement.appendChild(alert);

    var checkCookieMainSettingsResponse=await checkCookieMainSettings();
    if(checkCookieMainSettingsResponse)
    {
        
    }

    //checkOnLongTouchElements();
    observer.observe(targetNode, config);
});
function getSystemToast(message)
{
    try {
        document.getElementById("systemToast").remove(); 
    } catch (error) {}
    var systemToast=document.createElement("div");
    systemToast.setAttribute("class","system-toast-outer-container");
    systemToast.setAttribute("id","systemToast");
    systemToast.innerHTML=message;
    document.body.appendChild(systemToast);
    $("#systemToast").show(300,"swing");
    $("#systemToast").css("display","flex");
}
function removeSystemToast()
{
    try {
        $("#systemToast").hide(300,"swing");
    } catch (error) {}
}
//----------------------------------------------------------------------------------------------------------------------------------
function checkOnLongTouchElements()
{
    const longTouchElement = document.querySelectorAll('[onlongtouch]');
    for (let index = 0; index < longTouchElement.length; index++)
    {
        const element = longTouchElement[index];

        var elementOnclickFunction=element.getAttribute("onclick");
        
        var elementFunction=element.getAttribute("onlongtouch");
        var elementFunctionName=elementFunction.split("(")[0].trim();

        element.setAttribute("ontouchstart","touchStart(event,this,'"+elementFunctionName+"')");
        element.setAttribute("ontouchend","touchEnd(event)");
        element.setAttribute("onlongtouchid",index);
        element.setAttribute("ontouchmove","checkOnLongTouchMove(this,event)");

        if(element.getAttribute("onclick")!=null)
        {
            onlongtouchClickEvent=element.getAttribute("onclick");
            onlongtouchClickEvents[index]=onlongtouchClickEvent;
            element.removeAttribute("onclick");
        }
    }
}

var checkLongtouchMove;
var onlongtouchClickEvents=[];
var checkLongtouchTimeout, longtouch;
var timer;
var onlongtouchElement;
var onlongtouchEvent;
var onlongtouchArguments;
var touchduration = 500; //length of time we want the user to touch before we do something

function touchStart(e,element,elementFunctionName) 
{
    $("html").css({
        "-webkit-touch-callout": "none",
        "-webkit-user-select": "none",
        "-khtml-user-select": "none", 
        "-moz-user-select": "none", 
        "-ms-user-select": "none", 
        "user-select": "none"
    });
    $("html").attr("oncontextmenu","return false;");

    checkLongtouchMove=false;
    checkLongtouchTimeout = setTimeout(function() {
        longtouch = true;
    }, touchduration);

    onlongtouchArguments=[];
    var elementFunction=element.getAttribute("onlongtouch");
    var tmpOnlongtouchArguments=elementFunction.substring(
        elementFunction.lastIndexOf("(") + 1, 
        elementFunction.lastIndexOf(")")
    ).replace(/'/g, "").split(",");
    tmpOnlongtouchArguments.forEach(function (argument)
    {
        if(isNaN(argument))
        {
            if(argument=="false" || argument=="true")
                onlongtouchArguments.push(argument=="true");
            else
                onlongtouchArguments.push(String(argument));
        }
        else
            onlongtouchArguments.push(parseFloat(argument));
    });
    //e.preventDefault();
    onlongtouchElement=element;

    timer = setTimeout(function()
    {
        if(!checkLongtouchMove)
            executeFunctionByName(e,elementFunctionName, window);
    }, touchduration);
    //timer = setTimeout(window[elementFunctionName], touchduration);
}
function executeFunctionByName(event,functionName, context)
{
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) 
    {
        context = context[namespaces[i]];
    }
    return context[func].apply(context);
}
function checkOnLongTouchMove(element,event)
{
    checkLongtouchMove=true;
}
function touchEnd(e)
{
    onlongtouchEvent=e;
    if (!longtouch)
    {
        if(!checkLongtouchMove)
        {
            event.preventDefault();
            onlongtouchClickEvent=onlongtouchClickEvents[onlongtouchElement.getAttribute("onlongtouchid")];
            onlongtouchElement.setAttribute("onclick",onlongtouchClickEvent);
            onlongtouchElement.click();
        }
    }
    longtouch = false;
    clearTimeout(checkLongtouchTimeout);
    if (timer)
        clearTimeout(timer);
    
    setTimeout(function()
    {
        $("html").css({
            "-webkit-touch-callout": "",
            "-webkit-user-select": "",
            "-khtml-user-select": "", 
            "-moz-user-select": "", 
            "-ms-user-select": "", 
            "user-select": ""
        });
        $("html").removeAttr("oncontextmenu");
    }, 500);
}
//----------------------------------------------------------------------------------------------------------------------------------
var checkboxAutoLogin;
var showPopupAggiungiAllaHome;
async function checkCookieMainSettings()
{
    return new Promise(async function (resolve) 
    {
        var coockieCheckboxAutoLogin=await getCookie("checkboxAutoLogin");
        if(coockieCheckboxAutoLogin=="")
            checkboxAutoLogin=false;
        if(coockieCheckboxAutoLogin.indexOf("true")>-1)
            checkboxAutoLogin=true;
        if(coockieCheckboxAutoLogin.indexOf("false")>-1)
            checkboxAutoLogin=false;

        var coockieShowPopupAggiungiAllaHome=await getCookie("showPopupAggiungiAllaHome");
        if(coockieShowPopupAggiungiAllaHome=="")
            showPopupAggiungiAllaHome=true;
        if(coockieShowPopupAggiungiAllaHome.indexOf("true")>-1)
            showPopupAggiungiAllaHome=true;
        if(coockieShowPopupAggiungiAllaHome.indexOf("false")>-1)
            showPopupAggiungiAllaHome=false;
            
        resolve(true);
    });
}
// Detects if device is on iOS 
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
  }
  // Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

function getPopupAggiungiAllaHomeIos()
{
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","pupup-aggiungi-alla-home-outer-container");

    var span=document.createElement("span");
    span.innerHTML='Sapevi che puoi aggiungere la pagina alla Homepage?<br>';
    outerContainer.appendChild(span);

    var span=document.createElement("div");
    span.setAttribute("style","padding-top:10px");
    span.innerHTML='Segui questi step:';
    outerContainer.appendChild(span);

    var ul=document.createElement("ul");

    var li=document.createElement("li");
    li.innerHTML='<div><span>Visita questa pagina con Safari</span><i class="fab fa-safari fa-2x" style="margin-left:5px;color:#0079ff"></i></div>';
    ul.appendChild(li);

    var li=document.createElement("li");
    li.innerHTML='<div><span>Clicca sul pulsante</span><img src="images/ios-share-icon.png" style="margin-left:5px" height="24" width="21"></div>';
    ul.appendChild(li);

    var li=document.createElement("li");
    li.innerHTML='<div><span>Clicca sul pulsante Aggiungi a Home</span><i class="fal fa-plus-square fa-2x" style="margin-left:5px;color:#aaa"></i></div>';
    ul.appendChild(li);

    outerContainer.appendChild(ul);    

    Swal.fire
    ({
        title:"Aggiungi a Home",
        width:"100%",
        html: outerContainer.outerHTML,
        position:"bottom",
        showCloseButton: true,
        showConfirmButton:false,
        allowOutsideClick:true,
        onOpen : function()
                {
                    document.getElementsByClassName("swal2-title")[0].style.fontFamily="'Quicksand',sans-serif";
                    document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                    document.getElementsByClassName("swal2-title")[0].style.textAlign="left";
                    document.getElementsByClassName("swal2-title")[0].style.width="100%";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                }
    });
    setCookie("showPopupAggiungiAllaHome","false");
}
// Select the node that will be observed for mutations
const targetNode = document;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            //console.log('A child node has been added or removed.');
            checkOnLongTouchElements();
        }
        else if (mutation.type === 'attributes') {
            //console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
//observer.observe(targetNode, config);

// Later, you can stop observing
//observer.disconnect();
/*----------------------------------------------------------------------------------------------------------------------------------*/
function getFirstObjByPropValue(array,prop,propValue)
{
    var return_item;
    array.forEach(function(item)
    {
        if(item[prop]==propValue)
        {
            return_item= item;
        }
    });
    return return_item;
}
function enableLandscape()
{
    if(document.getElementById("disableLandscapeLink")!=null)
        document.getElementById("disableLandscapeLink").remove();
}
function disableLandscape()
{
    if(document.getElementById("disableLandscapeLink")==null)
    {
        var link=document.createElement("link");
        link.setAttribute("rel","stylesheet");
        link.setAttribute("id","disableLandscapeLink");
        link.setAttribute("href","css/disableLandscape.css");

        document.head.appendChild(link);
    }
}
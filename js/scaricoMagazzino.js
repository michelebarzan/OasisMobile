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
    id_utente=await getSessionValue("id_utente");
}
async function getPopupPreleva(code)
{
    Swal.fire
    ({
        title: "Caricamento in corso1...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        background:"transparent",
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    closeCamera();

    var description = await getDataScaricoMagazzino(code);
 
    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-outer-container");
    
    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML = "Codice: ";
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
    row.innerHTML = code;
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML = "Descrizione: "
    outerContainer.appendChild(row);
    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
    row.innerHTML = description;
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML = "Quantità: "
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    row.setAttribute("style","flex-direction:row;align-items:center;");

    var button = document.createElement("button");
    button.setAttribute("class","popup-button-secondary");
    button.setAttribute("style", "background-color: #DA6969;");
    button.setAttribute("onclick","remove()");
    button.innerHTML="<i class='far fa-minus'></i>";
    row.appendChild(button);

    var input=document.createElement("input");
    input.setAttribute("class","popup-input");
    input.setAttribute("id","inputQuantita");
    input.setAttribute("type","number");
    input.setAttribute("value","1");
    input.setAttribute("min","1");
    input.setAttribute("style","width:calc(100% - 10px);margin-left:5px;margin-right:5px");
    row.appendChild(input);

    var button = document.createElement("button");
    button.setAttribute("class","popup-button-secondary");
    button.setAttribute("style", "background-color: #70B085;");
    button.setAttribute("onclick","add()");
    button.innerHTML="<i class='far fa-plus'></i>";
    row.appendChild(button);
    outerContainer.appendChild(row);

    var button = document.createElement("button");
    button.setAttribute("class","popup-main-button");
    button.setAttribute("onclick", `uscitaMerci("${code}")`);
    button.innerHTML='<span>Conferma</span><i class="fad fa-check-circle"></i>';
    outerContainer.appendChild(button);

    Swal.fire
    ({
        width:"100%",
        background:"#404040",
        title:"Prelievo",
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
                    document.getElementsByClassName("swal2-title")[0].style.color="white";
                    document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
                    document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                    document.getElementsByClassName("swal2-close")[0].style.outline="none";
                },
        showCloseButton:true,
        showConfirmButton:false,
        showCancelButton:false,
        html:outerContainer.outerHTML
    });
}
async function getPopupControlla(code)
{
    Swal.fire
    ({
        title: "Caricamento in corso2...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        background:"transparent",
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    closeCamera();

    var description = await getDataScaricoMagazzino(code);
    var responseControlloMerci = await controlloMerci(code);

    if(responseControlloMerci.status == 200)
    {
        var quantita = responseControlloMerci.data.InStock;
        
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","popup-outer-container");
    
        var row=document.createElement("div");
        row.setAttribute("class","popup-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
        row.innerHTML = "Codice: ";
        outerContainer.appendChild(row);
    
        var row=document.createElement("div");
        row.setAttribute("class","popup-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
        row.innerHTML = code;
        outerContainer.appendChild(row);
    
        var row=document.createElement("div");
        row.setAttribute("class","popup-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
        row.innerHTML = "Descrizione: "
        outerContainer.appendChild(row);
       
        var row=document.createElement("div");
        row.setAttribute("class","popup-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
        row.innerHTML = description;
        outerContainer.appendChild(row);
    
        var row=document.createElement("div");
        row.setAttribute("class","popup-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
        row.innerHTML = "Quantità in magazzino: " 
        outerContainer.appendChild(row);
    
        var row=document.createElement("div");
        row.setAttribute("class","popup-row");
        row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
        row.innerHTML = quantita;
        outerContainer.appendChild(row);
    
        Swal.fire
        ({
            //position:"top",
            width:"100%",
            background:"#404040",
            title:"Controllo quantità",
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
                        document.getElementsByClassName("swal2-title")[0].style.color="white";
                        document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
                        document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                        document.getElementsByClassName("swal2-content")[0].style.padding="0px";
                        document.getElementsByClassName("swal2-close")[0].style.outline="none";
                    },
            showCloseButton:true,
            showConfirmButton:false,
            showCancelButton:false,
            html:outerContainer.outerHTML
        });
    }
    else
    {
        Swal.fire
        ({
            icon:"error",
            title: "Errore SAP",
            text: responseControlloMerci.data.Message,
            background:"#404040",
            showCloseButton:true,
            showConfirmButton:false,
            onOpen : function()
            {
                document.getElementsByClassName("swal2-title")[0].style.color="white";
                document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                document.getElementsByClassName("swal2-close")[0].style.outline="none";
                document.getElementsByClassName("swal2-content")[0].style.color="white";
                document.getElementsByClassName("swal2-content")[0].style.fontSize="12px";
            },
        }).then((result) =>
        {
            clearQuagga()
        });
    }
}
function add()
{
    var input = document.getElementById("inputQuantita");
    var value = input.value;
    value++;
    input.value = value;
}
function remove()
{
    var input = document.getElementById("inputQuantita");
    var value = input.value;
    value--;
    if(value>0)
        input.value = value;
}
function scanCode(type)
{
    selectedButton = type;
	App =
    {
		init: function ()
        {
            var self = this;
            Quagga.init(this.state, function (err)
            {
                if(document.getElementById("buttonCloseQuagga") == null)
                {
                    var button = document.createElement("button");
                    button.setAttribute("onclick","closeCamera();clearQuagga();");
                    button.setAttribute("id","buttonCloseQuagga");
                    button.setAttribute("class","button-close-quagga");
                    button.innerHTML='<i class="fal fa-times"></i>';
                    document.body.appendChild(button);
                }

                if (err)
                    return self.handleError(err);
                App.attachListeners();
                Quagga.start();

                //Rimuovo il drawing canvas (che è dove quagga disegna il detect del codebar) non è elegante ma funziona
                var drawingCanvas = Quagga.canvas.dom.overlay;
                drawingCanvas.style.display = 'none';
                drawingCanvas.remove();
            });
        },
		handleError: function (err)
        {
			console.log(err);
		},
		attachListeners: function ()
        {
			var self = this;
			$('.controls').on('change', 'input', function (e)
            {
				self.setState();
			});
		},
		setState: function ()
        {
			App.detachListeners();
			Quagga.stop();
			App.init();
		},
		state:
        {
			inputStream:
            {
				type: 'LiveStream',
				constraints:
                {
					facingMode: 'environment',
				},
			},
			locator:
            {
				patchSize: 'medium',
				halfSample: false,
                debug:
                {
                    showCanvas: false,
                }
			},
			numOfWorkers: 8,
			frequency: 10,
			decoder:
            {
				readers:
                [
					{
						format: 'code_39_reader',
						config: {},
					},
				],
			},
			locate: false,
		},
		lastResult: null,
	};

	App.init();

	Quagga.onDetected
    (
        function (result)
        {
            var code = result.codeResult.code;
            // console.log(code);
            if (App.lastResult !== code)
            {
                App.lastResult = code;
                switch (selectedButton)
                {
                    case "preleva":
                        getPopupPreleva(code);
                    break;
                    case "controllo":
                        getPopupControlla(code);
                    break;
                }
            }
        }
    );
};
async function uscitaMerci(code)
{
    var input = document.getElementById("inputQuantita");
    
    Swal.fire
    ({
        title: "Caricamento in corso3...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        background:"transparent",
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var username = "Quaia";
    var password = "Oasis2015";

    const url = `https://192.168.69.75:38443/UscitaMerci`;

    var body =
    {
		DocDate: new Date(),
		rows:
        [
            {
                ItemCode: code,
                Quantity: input.value
            }
		]
	}

    fetch
    (
        url,
        {
            method: "POST",
            mode: "cors",
            headers:
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Basic ' + btoa(`${username}:${password}`)
            },
            body: JSON.stringify(body)
        }
    )
    .then((response) => 
    {
        if(response.status == 200)
        {
            let timerInterval;
            Swal.fire
            ({
                icon:"success",
                title: "Materiale prelevato",
                background:"#404040",
                showCloseButton:true,
                showConfirmButton:false,
                timer: 2000,
                timerProgressBar: true,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                onClose: () => {clearInterval(timerInterval)}
            }).then((result) =>
            {
                clearQuagga();
            });
        }
        else
        {
            response.json().then((data) => 
            {
                Swal.fire
                ({
                    icon:"error",
                    title: "Errore SAP",
                    text: data.Message,
                    background:"#404040",
                    showCloseButton:true,
                    showConfirmButton:false,
                    onOpen : function()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.color="white";
                        document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
                        document.getElementsByClassName("swal2-close")[0].style.outline="none";
                        document.getElementsByClassName("swal2-content")[0].style.color="white";
                        document.getElementsByClassName("swal2-content")[0].style.fontSize="12px";
                    },
                }).then((result) =>
                {
                    clearQuagga()
                });
            });
        }
    });
}
function closeCamera()
{
    try
    {
        Quagga.stop();
        document.getElementById("interactive").innerHTML="";
        document.getElementById("buttonCloseQuagga").remove();
    } catch (error) {}
}
function clearQuagga()
{

}
function controlloMerci(code)
{
    Swal.fire
    ({
        title: "Caricamento in corso4...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        background:"transparent",
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

    var username = "Quaia";
    var password = "Oasis2015";

    const url = `https://192.168.69.75:38443/Giacenze?itemCode=${code}`;
    
    window.alert("4");
    console.log("ciao")

    return new Promise(function (resolve, reject) 
    {
        /*fetch
        (
            url,
            {
                method: "GET",
                mode: "cors",
                headers:
                {   
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Basic ' + btoa(`${username}:${password}`)
                },
            }
        )
        .then((response) => 
        {
            window.alert("2");
            response.json().then((data) => 
            {
                var result =
                {
                    status:response.status,
                    data
                }
                resolve(result);
            });
        });*/

        /*$.ajax({
            type: "GET",
            crossDomain: true,
            headers:
            {   
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Basic ' + btoa(`${username}:${password}`)
            },
            url
        }).done(function (data) {
            window.alert("2");
        });*/

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", 'Basic ' + btoa(`${username}:${password}`));
        xhr.onload = function () {
            window.alert(xhr.responseText);
        };
        xhr.send();
    });
}
function getDataScaricoMagazzino(code)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getDataScaricoMagazzino.php",{code},
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

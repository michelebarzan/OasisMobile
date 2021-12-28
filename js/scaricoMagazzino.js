// const urlPreleva = 'https://192.168.6.54:3000/api/preleva';
var nomePagina="Scarico Magazzino";
var pageInfo=
{
    pagina:"scaricoMagazzino.html",
    nomePagina:"Scarico Magazzino",
    id_pagina:"1056",
    fileName:"scaricoMagazzino"
};
var id_utente;
var today = new Date();
var selectedButton = "";

async function onloadscaricoMagazzino()
{
    id_utente=await getSessionValue("id_utente");
    
}
async function getPopupPreleva(code)
{
    var title = document.getElementById("title");
    title.innerHTML ="";
        Swal.fire
    ({
        title: "Caricamento in corso...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        background:"transparent",
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
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
    //per il momento è una text input perchè non ci sono descrizioni, potrebbe essere utile per inserire dati mentre fanno l'inventario 
    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;");
    row.innerHTML = description;
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML = "Quantità da prelevare: "
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    var input=document.createElement("input");
    input.setAttribute("class","popup-input");
    input.setAttribute("id","inputQuantita");
    input.setAttribute("type","number");
    input.setAttribute("value","0");
    input.setAttribute("placeholder", "Inserisci quantità...")
    row.appendChild(input);    


    var button = document.createElement("button");
    button.setAttribute("class","popup-button-secondary");
    button.setAttribute("style", "order: -1; background-color: red;");
    button.setAttribute("onclick","remove()");
    button.innerHTML="-"
    row.appendChild(button); 
    var button = document.createElement("button");
    button.setAttribute("class","popup-button-secondary");
    button.setAttribute("style", "order: 1; background-color: green;");
    button.setAttribute("onclick","add()");
    button.innerHTML="+"
    row.appendChild(button); 
    outerContainer.appendChild(row);

    var button = document.createElement("button");
    button.setAttribute("class","popup-main-button");
    button.setAttribute("onclick", `uscitaMerci("${code}")`);
    button.innerHTML='<span>Preleva</span><i class="fal fa-save"></i>';
    outerContainer.appendChild(button);

    Swal.fire
    ({
        //position:"top",
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
                    document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
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
async function getPopupInserisci(code)
{
    var title = document.getElementById("title");
    title.innerHTML ="";

    Swal.fire
    ({
        title: "Caricamento in corso...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        background:"transparent",
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });

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
    row.innerHTML = "Quantità da inserire: "
    outerContainer.appendChild(row);

    var row=document.createElement("div");
    row.setAttribute("class","popup-row");
    var input=document.createElement("input");
    input.setAttribute("class","popup-input");
    input.setAttribute("id","inputQuantita");
    input.setAttribute("type","number");
    input.setAttribute("value","0");
    input.setAttribute("placeholder", "Inserisci quantità...")
    row.appendChild(input);    

    var button = document.createElement("button");
    button.setAttribute("class","popup-button-secondary");
    button.setAttribute("style", "order: -1; background-color: red;");
    button.setAttribute("onclick","remove()");
    button.innerHTML="-"
    row.appendChild(button); 
    var button = document.createElement("button");
    button.setAttribute("class","popup-button-secondary");
    button.setAttribute("style", "order: 1; background-color: green;");
    button.setAttribute("onclick","add()");
    button.innerHTML="+"
    row.appendChild(button); 
    outerContainer.appendChild(row);

    var button = document.createElement("button");
    button.setAttribute("class","popup-main-button");
    button.innerHTML='<span>Inserisci</span><i class="fal fa-save"></i>';
    outerContainer.appendChild(button);

    Swal.fire
    ({
        //position:"top",
        width:"100%",
        background:"#404040",
        title:"Inserimento",
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
        title: "Caricamento in corso...",
        html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        background:"transparent",
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
    });
    var description = await getDataScaricoMagazzino(code);
    var quantita = await controlloMerci(code)
    console.log(quantita);
    var title = document.getElementById("title");
    title.innerHTML ="";
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
    row.innerHTML = quantita.InStock;
    outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
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
                    document.getElementsByClassName("swal2-title")[0].style.textOverflow="ellipsis";
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
function add(){
    var input = document.getElementById("inputQuantita");
    input.value++; 
}
function remove(){
    var input = document.getElementById("inputQuantita");
    input.value--; 
}
function scanCode(type) {
    selectedButton = type;
	var App = {
		init: function () {
			var self = this;
			Quagga.init(this.state, function (err) {
				if (err) {
					return self.handleError(err);
				}
				App.attachListeners();
				Quagga.start();
             //Rimuovo il drawing canvas (che è dove quagga disegna il detect del codebar) non è elegante ma funziona
            var drawingCanvas = Quagga.canvas.dom.overlay;
            drawingCanvas.style.display = 'none';
            drawingCanvas.remove();
			});
		},
		handleError: function (err) {
			console.log(err);
		},
		attachListeners: function () {
			var self = this;
			$('.controls').on('change', 'input', function (e) {
				self.setState();
			});
		},
		setState: function () {
			App.detachListeners();
			Quagga.stop();
			App.init();
		},

		state: {
			inputStream: {
				type: 'LiveStream',
				constraints: {
					facingMode: 'environment',
				},
			},
			locator: {
				patchSize: 'medium',
				halfSample: false,
                debug: {
                    showCanvas: false,
                }
			},
			numOfWorkers: 8,
			frequency: 10,
			decoder: {
				readers: [
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

	Quagga.onDetected(function (result) {
		var code = result.codeResult.code;
		// console.log(code);
		if (App.lastResult !== code) {
			App.lastResult = code;
            console.log(code);
            switch (selectedButton) {
                case "inserisci":
                    getPopupInserisci(code);
                    break;
                case "preleva":
                    getPopupPreleva(code);
                    break;
                case "controllo":
                    getPopupControlla(code);
                    break;
                default:
                    break;
            }
		}
	}
    );
};
async function uscitaMerci(code)
{
    var input = document.getElementById("inputQuantita");

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
                clearQuaggia();
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
                    clearQuaggia()
                });
            });
        }
    });
}
function clearQuaggia()
{

}
async function controlloMerci(code) {
    var usr = "Quaia";
    var pwd = "Oasis2015";
    const urlControlla = `https://192.168.69.75:38443/Giacenze?itemCode=${code}`;
    console.log(code);
	 const response = await fetch(urlControlla, {
		method: "GET",
        mode: "cors",
		headers: {   
			'Content-Type': 'application/json',
        	'Accept': 'application/json',
            'Authorization': 'Basic ' + btoa(`${usr}:${pwd}`)
	},
    // body: JSON.stringify({code})
	})
    return response.json();

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

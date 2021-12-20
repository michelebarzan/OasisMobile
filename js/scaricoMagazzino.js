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
    
    // getElencoCalendarioRegistrazioni();
}


function getPopupPreleva(code)
{
    //var id_utente=onlongtouchArguments[0];
    // var utente=getFirstObjByPropValue(utenti,"id_utente",id_utente);

    var outerContainer=document.createElement("div");
    outerContainer.setAttribute("class","popup-utenti-outer-container");
    console.log(code);
    var row=document.createElement("div");
    row.setAttribute("class","popup-input");
    row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    row.innerHTML=code;
    outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-foto-ordini-row");
    // row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    // var input=document.createElement("input");
    // input.setAttribute("type","text");
    // input.setAttribute("class","popup-utenti-input");
    // input.setAttribute("id","popupUtentiUsername");
    // input.setAttribute("value",utente.username);
    
    // row.appendChild(input);

    // outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-foto-ordini-row");
    // row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    // row.innerHTML="Nome";
    // outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-foto-ordini-row");
    // row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    // var input=document.createElement("input");
    // input.setAttribute("type","text");
    // input.setAttribute("class","popup-utenti-input");
    // input.setAttribute("id","popupUtentiNome");
    // input.setAttribute("value",utente.nome);
    
    // row.appendChild(input);

    // outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-foto-ordini-row");
    // row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    // row.innerHTML="Cognome";
    // outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-foto-ordini-row");
    // row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    // var input=document.createElement("input");
    // input.setAttribute("type","text");
    // input.setAttribute("class","popup-utenti-input");
    // input.setAttribute("id","popupUtentiCognome");
    // input.setAttribute("value",utente.cognome);
    
    // row.appendChild(input);

    // outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-foto-ordini-row");
    // row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    // row.innerHTML="Username PC";
    // outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-foto-ordini-row");
    // row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    // var input=document.createElement("input");
    // input.setAttribute("type","text");
    // input.setAttribute("class","popup-utenti-input");
    // input.setAttribute("id","popupUtentiUsernamePC");
    // if(utente.usernamePC!=null)
    //     input.setAttribute("value",utente.usernamePC);
    
    // row.appendChild(input);

    // outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-foto-ordini-row");
    // row.setAttribute("style","width:100%;color:#ddd;font-size: 12px;text-align:left;font-weight: normal;font-family: 'Quicksand',sans-serif;margin-bottom:5px;text-decoration:underline");
    // row.innerHTML="Mail";
    // outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-foto-ordini-row");
    // row.setAttribute("style","width:100%;margin-bottom:5px;justify-content:flex-start");

    // var input=document.createElement("input");
    // input.setAttribute("type","text");
    // input.setAttribute("class","popup-utenti-input");
    // input.setAttribute("id","popupUtentiMail");
    // if(utente.mail!=null)
    //     input.setAttribute("value",utente.mail);
    
    // row.appendChild(input);

    // outerContainer.appendChild(row);

    // var row=document.createElement("div");
    // row.setAttribute("class","popup-utenti-row");
    // row.setAttribute("style","width:100%;flex-direction:row;align-items:center;justify-content:space-between;flex-direction:row;margin-top:10px");

    // var rinominaButton=document.createElement("button");
    // rinominaButton.setAttribute("class","popup-utenti-button");
    // rinominaButton.setAttribute("style","width:100%;");
    // rinominaButton.setAttribute("onclick","salvaModificheUtente("+utente.id_utente+")");
    // rinominaButton.innerHTML='<span>Salva modifiche</span><i class="fal fa-save"></i>';
    // row.appendChild(rinominaButton);    

    // outerContainer.appendChild(row);

    Swal.fire
    ({
        //position:"top",
        width:"100%",
        background:"#404040",
        title:"Preleva...",
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

function scanCode(type) {
    selectedButton = type;
    console.log(selectedButton);
	var App = {
		init: function () {
			var self = this;
			Quagga.init(this.state, function (err) {
				if (err) {
					return self.handleError(err);
				}
				App.attachListeners();
				Quagga.start();
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
        console.log(result)
		var code = result.codeResult.code;
		// console.log(code);
		if (App.lastResult !== code) {
			App.lastResult = code;
			console.log(App.lastResult);
            switch (selectedButton) {
                case "preleva":
                    getPopupPreleva(code);
                    break;
                case "insersci":
                    getPopupInserisci(code);
                    break;
                case "controlla":
                    getPopupInserisci(code);
                    break;
                default:
                    break;
            }
			// preleva.addEventListener('click', (e) => {
			// 	e.preventDefault();
			// 	removeData(quantita.value, code).then(
			// 		(response) => {
			// 			response.json()
			// 		}
			// 	)
			// });
		}
	}
    );
};

async function removeData(quantita, code) {
	// var usr = "Quaia";
	// var pwd = "Oasis2015";
	var body = {
		DocDate: new Date(),
		rows: [
		  {
			ItemCode: code,
			Quantity: quantita
		  }
		]
	  }
	//   console.log(body);
	const response = await fetch(urlPreleva, {
		method: "POST",
		headers: {   
			'Content-Type': 'application/json',
        	'Accept': 'application/json'
	},
		body: JSON.stringify(body),
	});
	console.log(response);
	return response
	
}




//Caricamento in corso
// Swal.fire
// ({
//     title: "Caricamento in corso...",
//     html: '<i style="color:white" class="fad fa-spinner-third fa-spin fa-2x"></i>',
//     showConfirmButton:false,
//     showCloseButton:false,
//     allowEscapeKey:false,
//     allowOutsideClick:false,
//     background:"transparent",
//     onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-close")[0].style.outline="none";}
// });


//modale
//popupAnagraficaUtente
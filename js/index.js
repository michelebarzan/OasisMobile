async function getPagineHomepage()
{
    $(".homepageLinkContainer").empty();
    var id_utente=await getSessionValue("id_utente");
    $.get("getPageList.php",
    {
        id_utente
    },
    function(response, status)
    {
        if(status=="success")
        {
            var responseArray=[];
            var responseArrayObj = JSON.parse(response);
            for (var key in responseArrayObj)
            {
                responseArray.push(responseArrayObj[key]);							
            }
            
            var pagine_preferite=JSON.parse(responseArray[0]);
            var sezioni=JSON.parse(responseArray[1]);
            var homepageSectionContainerHeights=[];

            var container=document.getElementsByClassName("homepageLinkContainer")[0];

            var homepageSectionOuterContainer=document.createElement("div");
            homepageSectionOuterContainer.setAttribute("class","homepageSectionOuterContainer");

            var homepageSectionContainer=document.createElement("div");
            homepageSectionContainer.setAttribute("class","homepageSectionContainer");

            var homepageSectionTitle=document.createElement("div");
            homepageSectionTitle.setAttribute("class","homepageSectionTitle");
            homepageSectionTitle.innerHTML="Preferiti";
            homepageSectionOuterContainer.appendChild(homepageSectionTitle);

            for(var i=0;i<pagine_preferite.length;i++)
            {
                var pagina=pagine_preferite[i];
                
                var homepageLink=document.createElement("div");
                homepageLink.setAttribute("class","homepageLink");
                homepageLink.setAttribute("onclick","gotopath('"+pagina['pagina']+"')");

                var homepageLinkIcon=document.createElement("i");
                homepageLinkIcon.setAttribute("class",pagina['icona']);

                var homepageLinkName=document.createElement("div");
                homepageLinkName.innerHTML=pagina["nomePagina"];

                homepageLink.appendChild(homepageLinkIcon);
                homepageLink.appendChild(homepageLinkName);

                homepageSectionContainer.appendChild(homepageLink);
            }

            homepageSectionOuterContainer.appendChild(homepageSectionContainer);
            container.appendChild(homepageSectionOuterContainer);

            homepageSectionContainerHeights.push(homepageSectionOuterContainer.offsetHeight);

            for(var i=0;i<sezioni.length;i++)
            {
                var sezione=sezioni[i];

                var homepageSectionOuterContainer=document.createElement("div");
                homepageSectionOuterContainer.setAttribute("class","homepageSectionOuterContainer");

                var homepageSectionContainer=document.createElement("div");
                homepageSectionContainer.setAttribute("class","homepageSectionContainer");

                var homepageSectionTitle=document.createElement("div");
                homepageSectionTitle.setAttribute("class","homepageSectionTitle");
                homepageSectionTitle.innerHTML=sezione["sezione"];

                homepageSectionOuterContainer.appendChild(homepageSectionTitle);

                var pagine_sezioni=sezione['pagine'];
                for(var k=0;k<pagine_sezioni.length;k++)
                {
                    var pagina=pagine_sezioni[k];

                    var homepageLink=document.createElement("div");
                    homepageLink.setAttribute("class","homepageLink");
                    homepageLink.setAttribute("onclick","gotopath('"+pagina['pagina']+"')");

                    var homepageLinkIcon=document.createElement("i");
                    homepageLinkIcon.setAttribute("class",pagina['icona']);

                    var homepageLinkName=document.createElement("div");
                    homepageLinkName.innerHTML=pagina["nomePagina"];

                    homepageLink.appendChild(homepageLinkIcon);
                    homepageLink.appendChild(homepageLinkName);

                    homepageSectionContainer.appendChild(homepageLink);
                }

                homepageSectionOuterContainer.appendChild(homepageSectionContainer);
                container.appendChild(homepageSectionOuterContainer);

                homepageSectionContainerHeights.push(homepageSectionOuterContainer.offsetHeight);
            }

            var maxHeight = Math.max.apply(null, homepageSectionContainerHeights);

            $(".homepageSectionOuterContainer").height(maxHeight);
        }
        else
            console.log(status);
    });
}
function gotopath(path)
{
    window.location = path;
}
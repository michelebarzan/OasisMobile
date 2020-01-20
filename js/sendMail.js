function sendMail(mails,subject,body)
{
    var JSONmails=JSON.stringify(mails);
    $.post("sendMail.php",
    {
        JSONmails,
        subject,
        body
    },
    function(response, status)
    {
        if(status=="success")
        {
            //console.log(response);
        }
        else
            console.log(status)
    });
}
<?php
    $JSONfiles=$_REQUEST["JSONfiles"];
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foto condivise</title>
    <script src="js/shareCloudFoto.js"></script>
    <link href="css/shareCloudFoto.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
    <link href="libs/css/fontawesome/css/all.css" rel="stylesheet">
    <script>
        var files=<?php echo $JSONfiles; ?>;
    </script>
</head>
<body></body>
</html>
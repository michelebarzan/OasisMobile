<?php
    $path=$_REQUEST["path"];
    $nome=$_REQUEST["nome"];
    $id_cartella=$_REQUEST["id_cartella"];
    $tipo=$_REQUEST["tipo"];
    $files=$_REQUEST["files"];
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cartella <?php echo $nome; ?></title>
    <script src="js/shareCloudFoto.js"></script>
    <link href="css/shareCloudFoto.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
    <link href="libs/css/fontawesome/css/all.css" rel="stylesheet">
</head>
<body>
    <input type="hidden" id="hiddenNome" value="<?php echo $nome; ?>">
    <input type="hidden" id="hiddenPath" value="<?php echo $path; ?>">
    <input type="hidden" id="hiddenId_cartella" value="<?php echo $id_cartella; ?>">
    <input type="hidden" id="hiddenTipo" value="<?php echo $tipo; ?>">
    <input type="hidden" id="hiddenFiles" value="<?php echo $files; ?>">
</body>
</html>
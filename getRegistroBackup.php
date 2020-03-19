<?php

      $contenutoFile=[];

      $myfile = fopen("C:/bk/registro.txt", "r") or die("#|error|#");
      while(!feof($myfile))
      {
          array_push($contenutoFile,utf8_encode(fgets($myfile)));
      }
      fclose($myfile);

      $arrayResponse["nomeFile"]="registro.txt";
      $arrayResponse["dataModifica"]=date("d/m/Y H:i:s", filemtime("C:/bk/registro.txt"));
      $arrayResponse["contenutoFile"]=$contenutoFile;

      echo json_encode($arrayResponse);
?>
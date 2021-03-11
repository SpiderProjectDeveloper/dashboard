﻿<?php
require('auth.php');

if( isAuthRequired() ) {
	$userName = auth(false);
} 
?>

<!DOCTYPE html>
<html lang = "en">
   <head>
      <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
      <meta charset="UTF-8" />
      <title>A Dashboard</title>
	
	  <style>
			body { box-sizing:border-box; -moz-box-sizing: border-box; margin:0; padding:0; background-color:#ffffff; font-family:arial; }
			* { box-sizing:border-box; -moz-box-sizing: border-box; margin:0; padding:0; }
	  </style>

   </head>
   <body>
      <div id="app" data-phpuser="<? echo $userName; ?>"</div>
      <script charset="utf-8" src='bundle.js'></script>
   </body>
</html>



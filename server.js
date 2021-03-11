// server.js
const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
// the __dirname is the current directory from where the script is running

// app.use(express.static(__dirname + '/public/'));
// send the user to index html page inspite of the url

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/favicon.ico'));
});


app.get('/index.php', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.php'));
});


app.get('/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/bundle.js'));
});

app.get('/data.php', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/data.php'));
});

app.get('/.dashboard_data', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/data.php'));
});

app.get('/.get_image', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/images/pic.jpg'));
});

app.listen(port);
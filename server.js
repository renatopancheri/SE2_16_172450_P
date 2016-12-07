//Libraries (default)
var http = require('http');

//for templates
var bind = require('bind');
var ip='127.0.0.1';
var port=1337;

var headers = {};//definisco gli header di default
headers["Access-Control-Allow-Origin"] = "*"; //for cross enviroment request
headers["Access-Control-Allow-Methods"] = "GET";//methods allowed to responce
headers["Access-Control-Allow-Credentials"] = false;
headers["Access-Control-Max-Age"] = '86400'; // 24 hours
headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"; //type of headers
//answer
headers["Content-Type"] = "text/html";//format response


var express = require('express');
var url=require('url');

var results=require('./create_results.js');
//instantiate express
var app = express();

app.set('port', (process.env.PORT || port));
app.use(express.static('client_files'));//mappa tutte le richieste di files del tipo http://ip:port/* in client_files/*
//use: for both POST and GET

app.get('/search_results.html',function(request,response){//search_results.html è il template
	response.writeHead(200, headers);
	var url_parts = url.parse(request.url, true);
	var getVar = url_parts.query; //estraggo gli attributi dalla richiesta
	var ret=results.main(getVar);//chiamo la funzione main del modulo results che restituisce tutti i parametri per il binding del template
	bind.toFile('tpl/search_results.tpl',
	ret,//risultati dalla funzione results.main()
    function(data) 
    {
        //write response
        response.end(data);
    });
});


listener=app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'),listener.address());
});

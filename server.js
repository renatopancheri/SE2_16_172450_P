//Libraries (default)
var http = require('http');
var bind = require('bind');
var express = require('express');
var app = express();//instantiate express
var url=require('url');
//default settings(ip,port,headers)
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


app.set('port', (process.env.PORT || port));

app.use(express.static('client_files'));//mappa tutte le richieste di files del tipo http://ip:port/* in client_files/*
//use: for both POST and GET

//for templates
var results=require('./create_results.js');

app.get('/search_results.html',function(request,response){//search_results.html è il template
	var url_parts = url.parse(request.url, true);
	var getVar = url_parts.query; //estraggo gli attributi dalla richiesta
	var ret=results.main(getVar);//chiamo la funzione main del modulo results che restituisce tutti i parametri per il binding del template e lo statusCode
	bind.toFile(
		'tpl/search_results.tpl',
		ret.bindingObject,//risultati dalla funzione results.main()
		function(data) {
			//write response
			response.writeHead(ret.statusCode, headers);//lo statusCode viene deciso dalla funzione results.main()
			response.end(data);
		}
	);
});


listener=app.listen(app.get('port'), function() {//start server
  console.log('Node app is running on port', app.get('port'),listener.address());
});

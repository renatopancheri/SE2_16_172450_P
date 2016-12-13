//Libraries (default)

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
var create_results=require('./create_results.js');

app.get('/search_results.html',function(request,response){//search_results.html è il template
	function callback(servlet_response){
		if(servlet_response.statusCode===400){
			sendError(request,response,400);
		}
		else{
			bind.toFile(
				create_results.path,
				servlet_response.bindingObject,//risultati dalla funzione results.main()
				function(data) {
					//write response
					response.writeHead(servlet_response.statusCode, headers);//lo statusCode viene deciso dalla funzione results.main()
					response.end(data);
				}
			);
		}
	}

	var url_parts = url.parse(request.url, true);
	var getVar = url_parts.query; //estraggo gli attributi dalla richiesta
	create_results.main(getVar,callback);//chiamo la funzione main del modulo results che restituisce tutti i parametri per il binding del template e lo statusCode
	
});



/*
  questa funzione viene usata per inviare un messaggio di errore 
  diverso a seconda dell statuscode.


*/
function sendError(req,res,code){
	bind.toFile(
		'errors/'+code+'.html',
		{},
		function(data){
			res.writeHead(code, headers);//lo statusCode viene deciso dalla funzione results.main()
			res.end(data);
		}
	);

}
//Handle 404 
//questo app.use senza parametri catcha tutto quello che non viene preso prima, cioè i 404
app.use(function(req,res){
	sendError(req,res,404);
});

// Handle 500
//questo invece ha una funzione con 4 parametri , catcha un errore (500 HTTP)
app.use(function(error, req, res, next) {
	console.log(error);
	sendError(req,res,500);
});

listener=app.listen(port, function() {//start server
  //console.log('Node app is running on port', app.get('port'),listener.address());
});

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
var create_results=require('./create_results.js');

app.get('/search_results.html',function(request,response){//search_results.html è il template
	var url_parts = url.parse(request.url, true);
	var getVar = url_parts.query; //estraggo gli attributi dalla richiesta
	var servlet_response=create_results.main(getVar);//chiamo la funzione main del modulo results che restituisce tutti i parametri per il binding del template e lo statusCode
	if(servlet_response.statusCode===400){
		Error404(request,response);
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
});

function Error404(req,res){
	bind.toFile(
		'errors/404.html',
		{},
		function(data){
			res.writeHead(404, headers);//lo statusCode viene deciso dalla funzione results.main()
			res.end(data);
		}
	);

}

app.use(Error404);
  
  // Handle 500
  app.use(function(error, req, res, next) {
     res.send('500: Internal Server Error', 500);
  });



listener=app.listen(app.get('port'), function() {//start server
  console.log('Node app is running on port', app.get('port'),listener.address());
});

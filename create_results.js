var path='tpl/search_results.tpl';
var http = require('http');
var https = require('https');
var querystring=require("querystring");
/*
  funzione principale che viene chiamata dal server, prende in ingresso gli attributi della richiesta 
  e restituisce un oggetto valido per il binding del template

*/
function main(request,callback){
	var flags=[false,false];//rappresenta lo stato dellle richieste che il server fa a diversi indirizzi, diventa true quando la riposta è arrivata ed è stata processata
	var results=[];
	var keys=Object.keys(request);
	if(keys.length!==1){
		callback({statusCode:400});
		return;
	}
	if(keys[0]!=="search"){
		callback({statusCode:400});
		return;
	}
	if(request.search===''){//controllo che i parametri siano corretti
		callback({statusCode:400});
		return;
	}
	addUnitn(results,request.search,callback,flags);
	addEsse3(results,request.search,callback,flags);
}

/*
  aggiunge i risultati della ricerca di unitn.it
  mi viene ritornata dal server unitn una stringa rappresentante la funzione di callback che ha come parametri i risultati che voglio io
  (il server ritorna :  google.[...].[...]({...});)
  io tolgo la parte iniziale(fino a '{' ) e finale ( tolgo ');'  ) in questo modo mi resta un oggetto che posso parsare con json
  a questo punto mi basta estrarre i parametri che mi interessano

*/
function addUnitn(results,keyword,mainCallback,flags){
	var url="https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz=filtered_cse&num=10&hl=it&prettyPrint=false&source=gcsc&gss=.it&sig=0c3990ce7a056ed50667fe0c3873c9b6&cx=016117172621427316264:hk17am2yce8&q="+keyword+"&googlehost=www.google.com&oq="+keyword+"&gs_l=partner.3..0l10.8377.9264.2.9527.5.0.5.0.1.0.0.0..0.0.gsnos%2Cn%3D13.1..0.9317j71547943j6j1..1ac.1.25.partner..0.19.1555.Bf_G3UxDUFU&callback=google.search.Search.apiary17166";
	var callback = function(response) {
		var str = '';
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			var j=JSON.parse(str.substring(str.indexOf('(')+1,str.length-2));
			
			for(var i=0;i<j.results.length;i++){
				results.push({fonte:"unitn",link:j.results[i].clicktrackUrl,shortlink:j.results[i].title});
			}
			flags[0]=true;
			checkCallback(results,mainCallback,flags);
		});
	}
	https.get(url, callback).end();
}
/*
  aggiunge i risultati della ricerca di esse3
  in questo caso mi viene ritornata ua pagina html

*/
function addEsse3(results,keyword,mainCallback,flags){
	var params=querystring.stringify({//questi sono i parametri che manda il form in esse3
		annoAccademico:"2016",
		facoltaPoli:"X",
		corsoId:"X",
		linguaDidId:"X",
		nomeDocente:"",
		nomeInse:keyword,
		statoRicerca:"FILTRA",
		form_id_form1:"form1",
		actionBar1:"Cerca"
	});
	var options={
		hostname:"www.esse3.unitn.it",
		path:"/Guide/PaginaRicercaInse.do",
		method:"POST",
		headers:{
			"Host": "www.esse3.unitn.it",
			"Content-Length": Buffer.byteLength(params),//header necessari perché esse3 possa processare la mia richiesta
			"Content-Type":"application/x-www-form-urlencoded"

		}
	}
	var callback=function(response){
		var str = '';
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});
		
		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			var startIndex=0,temp;
			var risultatoAttuale=str.indexOf("risultati-text",startIndex);//ogni risultato ha un div con un id con pattern risultati-text-[numero]
			for(;risultatoAttuale!==-1;startIndex=risultatoAttuale+1,risultatoAttuale=str.indexOf("risultati-text",startIndex)){
				temp=str.indexOf("href=",risultatoAttuale)+6;//href=" sono 6 caratteri
				results.push({
					fonte:"esse3",
					link:"https://www.esse3.unitn.it/"+str.substring(temp,str.indexOf("\"",temp)),//il link finisce con "
					shortlink:str.substring(str.indexOf(">",temp)+1,str.indexOf("</a>",temp))//il testo del link è tra > e </a>
				});

			}
			flags[1]=true;
			checkCallback(results,mainCallback,flags);
			
		});
	}
	var req=https.request(options,callback);
	req.write(params);
	req.end();
}

/*
  controllo che si possa fare la callback al server (solo su tutte le richieste sono state risposte)

*/
function checkCallback(results,callback,flags){
	var check=true;
	for(var i=0;i<flags.length;i++){//se tutti i flag sono a true
		check=check&&flags[i];
	}
	if(check){//faccio la callback con i risultati che ho creato
		callback(
		{
			statusCode:200,
			bindingObject:{
				results:results
			}
		});
	}
}

module.exports = {
  main,
  path
};

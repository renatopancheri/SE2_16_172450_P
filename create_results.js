var path='tpl/search_results.tpl';
var http = require('http');
var https = require('https');
var wait=require('wait.for');
var flags=[false];
var maincallback;
/*
  funzione principale che viene chiamata dal server, prende in ingresso gli attributi della richiesta 
  e restituisce un oggetto valido per il binding del template

*/
function main(request,cb){
	var results=[];
	var keys=Object.keys(request);
	if(keys.length!==1){
		return {statusCode:400};
	}
	if(keys[0]!=="search"){
		return {statusCode:400};
	}
	if(request.search===''){
		return {statusCode:400};
	}
	maincallback=cb;
	addunitn(results,request.search);
}

/*
  aggiunge i risultati della ricerca in unitn.it

*/
function addunitn(results,keyword){
	var url="https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz=filtered_cse&num=10&hl=it&prettyPrint=false&source=gcsc&gss=.it&sig=0c3990ce7a056ed50667fe0c3873c9b6&cx=016117172621427316264:hk17am2yce8&q="+keyword+"&googlehost=www.google.com&oq="+keyword+"&gs_l=partner.3..0l10.8377.9264.2.9527.5.0.5.0.1.0.0.0..0.0.gsnos%2Cn%3D13.1..0.9317j71547943j6j1..1ac.1.25.partner..0.19.1555.Bf_G3UxDUFU&callback=google.search.Search.apiary17166";
	callback = function(response) {
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
			checkcallback(results);
		});
	}
	https.get(url, callback).end();
}

function checkcallback(results){
	var check=true;
	for(var i=0;i<flags.length;i++){
		check=check&&flags[i];
	}
	if(check){
		maincallback(
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

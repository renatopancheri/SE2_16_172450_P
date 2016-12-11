var path='tpl/search_results.tpl';
/*
  funzione principale che viene chiamata dal server, prende in ingresso gli attributi della richiesta 
  e restituisce un oggetto valido per il binding del template

*/
function main(request){
	console.log(request);
	var keys=Object.keys(request);
	if(keys.length!==1){
		return {statusCode:400};
	}
	if(keys[0]!=="search"){
		return {statusCode:400};
	}
	//
	return {
		statusCode:200,
		bindingObject:{
			results:[{fonte:"asd",link:"/",shortlink:"home"}]
		}
	};
}

module.exports = {
  main,
  path
};

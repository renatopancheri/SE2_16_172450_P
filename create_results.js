/*
  funzione principale che viene chiamata dal server, prende in ingresso gli attributi della richiesta 
  e restituisce un oggetto valido per il binding del template

*/
function main(request){
	console.log(request);
	return {results:[{fonte:"asd",link:"/",shortlink:"home"}]};

}

module.exports = {
  main
};

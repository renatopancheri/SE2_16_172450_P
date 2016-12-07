var request=require("request");
var url="http://127.0.0.1:1337";
describe("testGet", function() {
	it("/", testGet("/"));
	it("/index.html", testGet("/index.html"));
	it("/search_results.html", testGet("/search_results.html"));
});


/*
	ritorno un funzione che controlla che il metodo get sul percorso relativo dato in ingresso risponda 200 OK


*/
function testGet(percorso){
	var ret = function(done){
		expect(typeof percorso).toBe("string");//controllo che sia stata data una stringa in ingresso
		request.get(
			url+percorso,//fattio il get so url_del_server+percorso_specificato
			function (error,response,body){
				expect(response.statusCode).toBe(200);//200 OK
				done();//callback perché get è asincrono
			});
	}
	return ret;
}

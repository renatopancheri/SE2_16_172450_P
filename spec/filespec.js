var request=require("request");
var url="http://127.0.0.1:5000";
describe("testGet", function() {
	it("/", testGet("/",200));
	it("/index.html", testGet("/index.html",200));
	it("/percorsoinesistente", testGet("/percorsoinesistente",404));
	it("/search_results.html", testGet("/search_results.html",400));
	it("/search_results.html?robe=123", testGet("/search_results.html?robe=123",400));
	it("/search_results.html?search=as&abc=123", testGet("/search_results.html?search=as&abc=123",400));
	it("/search_results.html?search=", testGet("/search_results.html?search=",400));
	it("/search_results.html?search=123", testGet("/search_results.html?search=123",200),25000);
});


/*
	ritorno un funzione che controlla che il metodo get sul percorso relativo dato in ingresso risponda 200 OK


*/
function testGet(percorso,statusCode){
	var ret = function(done){
		expect(typeof percorso).toBe("string");//controllo che sia stata data una stringa in ingresso
		request.get(
			url+percorso,//fattio il get so url_del_server+percorso_specificato
			function (error,response,body){
				expect(response.statusCode).toBe(statusCode);//200 OK
				done();//callback perché get è asincrono
			});
	}
	return ret;
}

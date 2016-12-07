# SE2_16_172450_P
progetto finale
server.js si occupa solo di gestire le richieste, è create_results.js che manipola i dati e definisce coma sarà la risposta
server.js manda i parametri alla funzione principale di create_results.js che crea un oggetto gia pronto per il binding del template search_results.tpl
in questo modo separo quello che è gestione delle richieste, parametri ,ecc (livello http)da quello che è la vera applicazione(manipolazione dati)

regole che seguo per il git:

nel branch work metto ogni cosa che creo , anche se non funziona
nel branch dev ci sono cose che "sembra che funzionino", ancora da testare
commenti e documentazione viene messa nel dev e poi trasferita sugli altri branch
nuovo codice viene messo nel work e poi trasferito in dev
nel branch dev c'è quindi sempre una versione apparentemente funzionante e commentata
il branch work è invece "work in progress"

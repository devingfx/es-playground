'use strict';

String.combine = function( ss, pp )
{
    // !ss.map && (ss = [ss])
    ss = ss.map ? ss : [ss]
    return ss.map( (s,i) => s + (typeof pp[i] != 'undefined' ? pp[i] : '') )
                            .join('')
}

// HTTP`GET toto.json`

async function HTTP( ss, ...pp )
{
	debugger;
	let lines = String.combine( ss, pp ).split('\n')
      , verb = lines[0].split(' ')[0]
      , url = lines.shift().replace( verb, '' ).trim()
      , hasBody = lines.indexOf('') != -1
      , headers = hasBody ? lines.slice(0,lines.indexOf('')) : lines
      //, herders = lines.map( l=> !lines.found && l == '\n' ? lines.found = true : l )
      //				   .filter( o=> typeof o == 'string' )
      //				   .map( s=> s.split(':').map(s=>s.trim()) )
      , req = hasBody ? lines.slice(lines.indexOf('')+1).join('\n') : false
      //, req = lines.map( l=> !lines.found2 && l == '\n' ? lines.found2 = true : l )
  				//   .filter( o=> typeof o == 'string' )
  				//   .map( s=> s.split(':').map(s=>s.trim()) )
      ;
	let request,
		prom = new Promise( (ok,ko)=>{
			
			request = new XMLHttpRequest();
			request.onload = e=> ok( request.response )
			request.onerror = e=> ko( request.statusText )
			request.onprogress = e=> progress( e.loaded, e.total )
			request.open( verb, url );
			request.setRequestHeader( "X-Requested-With", "XMLHttpRequest" )
			headers.map( h=> request.setRequestHeader(...h) )
			request.send()
			
		})
	prom.request = request
	prom.progress = cb=> progress.push(cb)
	return prom
}

'GET POST OPTIONS UPDATE DELETE'.split(' ')
.map( verb=> exports[verb] = function(ss,...pp)
{
	ss = Array.from( ss )
	ss[0] = verb +' '+ ss[0]
	return HTTP(ss,...pp)
})


/* 
GET`./wot/members\nAccept: application/json`.then( text=> doSomething(text) )
let res = await GET`./wot/members\nAccept: application/json`
let res = await GET`./wot/members`.header`Accept: application/json`
POST`catalog/book
Accept: application/json

${JSON.stringify(myNewBook)}`
.then( res=> console.info(res) )
*/


// var JGET = (ss,...pp)=> GET`Accept: application/json\n${ss.map((s,i)=>s+pp[i]||'')}`
var JGET = (ss,...pp)=> GET`${String.combine( ss, pp )}\nAccept: application/json`.then(s=>JSON.parse(s))

function HOST( ss, ...pp )
{
	var host = String.combine( ss, pp )
	return new Proxy({},{
		
		get:(o,p)=> JGET`${host}${p}`,
		// get(o,p){ return JGET`${host}${p}` },
		set:(o,p,v)=> POST`${host}${p}\n\n${JSON.stringify(v)}`
		// set(o,p,v){ return POST`${host}${p}\n\n${JSON.stringify(v)}` }
	})
}



var exemple = { com: HOST`https://api.exemple.com/` }


exemple.com['some/datas'].then( data=> data.results.map( Something ) )


let data = await exemple.com['some/datas']
data.results.map( Something )

exemple.com['some/data/add'] = { some: { data: true }}
let res = await exemple.com['some/data/add'] = { some: { data: true }}



function HOSTS( ss, ...pp )
{
	var hosts = String.combine( ss, pp )
					.split('\n')
					.filter(o=>o)
					.map( s=> ({
						url: s,
						_delay: 1000,
						_last: 0,
						_queue: [],
						_status: 'DOWN',
						get status(){return this._status},
						set status(v){if(this._status != v) this._status = v},
						advanceQueue(){
							
						}
					}) )
	return new Proxy(hosts,{
		
		get:(o,p)=> Reflect.hasOwnProperty(o,p) ? Reflect.get(o,p) : JGET`${host}${p}`,
		// get(o,p){ return JGET`${host}${p}` },
		set:(o,p,v)=> Reflect.hasOwnProperty(o,p) ? Reflect.set(o,p,v) : POST`${host}${p}\n\n${JSON.stringify(v)}`
		// set(o,p,v){ return POST`${host}${p}\n\n${JSON.stringify(v)}` }
	})
}

let swarm = HOSTS`
https://exemple.com/
https://api.exemple.com/
https://another.exemple.org/api/
`

swarm['some/datas']












function sGET( ss )
{
    let lines = String.combine.apply( 0, arguments ).split('\n')
      , url = lines.shift()
      , req = lines
      ;
    var p = new Promise( (done,fail) => {
        
        console.log(`GET:${url}`)
        
        if( localStorage[url] )
            return setTimeout( done, 1, JSON.parse(localStorage[url]) );
        
        var loader = new XMLHttpRequest();
        loader.addEventListener( 'load', e => {
            
            
            done( JSON.parse(localStorage[url] = e.target.response) )
            
        } );
        loader.open( 'GET', url );
        req.map( line => line !=='' && loader.setRequestHeader(line.split(':')[0].trim(), line.split(':')[1].trim() ) )
        // loader.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );
        // loader.setRequestHeader( "Accept", "application/json" );
        loader.send();
    })
    return p.then.bind(p)
}

sGET.json = function()
{
    let lines = String.combine.apply( 0, arguments ).split('\n')
      , url = lines.shift()
      , req = lines
      ;
    return GET`${url}
               X-Requested-With: XMLHttpRequest
               Accept: application/json`
}
function GET( ss )
{
    return HTTP `GET ${url}`
}

function HTTP()
{
    let lines = String.combine.apply( 0, arguments ).split('\n')
      , type = lines[0].split(' ')[0]
      , url = lines.shift().replace( type, '' ).trim()
      , req = lines
      ;
    
    function ajax( method, url, args )
    {
        // On établit une promesse en retour
        return new Promise( function (resolve, reject)
        {
            // On instancie un XMLHttpRequest
            var client = new XMLHttpRequest();
            var uri = url;
    
            if (args && (method === 'POST' || method === 'PUT'))
            {
                uri += '?';
                var argcount = 0;
                for (var key in args) {
                    if (args.hasOwnProperty(key))
                    {
                        if (argcount++) {
                            uri += '&';
                        }
                        uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                    }
                }
            }
    
            client.open(method, uri);
            client.send();
    
            client.onload = function ()
            {
                if (this.status >= 200 && this.status < 300)
                {
                    // On utilise la fonction "resolve" lorsque this.status vaut 2xx
                    resolve(this.response);
                }
                else
                {
                    // On utilise la fonction "reject" lorsque this.status est différent de 2xx
                    reject(this.statusText);
                }
            };
            client.onerror = function ()
            {
                reject(this.statusText);
            };
        });
    }
    
    var p = ajax(type, url, args);
    return p.then.bind(p);
}

// A-> $http cette fonction est implémentée pour respecter le patron
// de conception (pattern) Adaptateur
function HTTP(url)
{
 
  // Un exemple d'objet
  var core = {

    // La méthode qui effectue la requête AJAX
    ajax : function (method, url, args) {

      // On établit une promesse en retour
      var promise = new Promise( function (resolve, reject) {

        // On instancie un XMLHttpRequest
        var client = new XMLHttpRequest();
        var uri = url;

        if (args && (method === 'POST' || method === 'PUT')) {
          uri += '?';
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                uri += '&';
              }
              uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
            }
          }
        }

        client.open(method, uri);
        client.send();

        client.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // On utilise la fonction "resolve" lorsque this.status vaut 2xx
            resolve(this.response);
          } else {
            // On utilise la fonction "reject" lorsque this.status est différent de 2xx
            reject(this.statusText);
          }
        };
        client.onerror = function () {
          reject(this.statusText);
        };
      });

      // Return the promise
      return promise;
    }
  };

  // Pattern adaptateur
  return {
    'get' : function(args) {
      return core.ajax('GET', url, args);
    },
    'post' : function(args) {
      return core.ajax('POST', url, args);
    },
    'put' : function(args) {
      return core.ajax('PUT', url, args);
    },
    'delete' : function(args) {
      return core.ajax('DELETE', url, args);
    }
  };
};




// Fin de A

// B-> Ici on définit les fonctions et les charges utiles
var mdnAPI = 'https://developer.mozilla.org/en-US/search.json';
var payload = {
  'topic' : 'js',
  'q'     : 'Promise'
};

var callback = {
  success : function(data){
     console.log(1, 'success', JSON.parse(data));
  },
  error : function(data){
     console.log(2, 'error', JSON.parse(data));
  }
};
// End B


// var api = HTTP`https://developer.mozilla.org/en-US/search.json`;
// api(callback.success, callback.error);

// POST `http://ipinfo.io/
// Content-Type: application/json
// { "foo": ${foo},
//       "bar": ${bar}}`
//     ( d => console.log(d) )

// GET `http://ipinfo.io/`
//     ( d => console.log(d) )

// GET `http://ipinfo.io/${test_net.peers[8].endpoints[0].ip}`
//     ( d => console.log(d) )

// GET `http://ipinfo.io/${test_net.peers[8].endpoints[0].ip}
//      X-Requested-With: XMLHttpRequest
//      Accept: application/json`
//     ( d => console.log(d) )

// HTTP`GET https://developer.mozilla.org/en-US/search.json?${payload}`
//     (callback.success)
//     .catch(callback.error)

// GET`https://developer.mozilla.org/en-US/search.json
//     Accept: application/json
//     ${payload}`
//     (callback.success)
//     .catch(callback.error)

// GET.json`http://ipinfo.io/${peer.ip}`
//     ( d => (peer.location = d) )

// this.api`network/peers/index.html?some=query&string=true`( data => data );
// this.api.network.peers.index({some:'query',string:true})[HTTP.format].html( data => data );
// this.api.network.peers.index({some:'query',string:true})[HTTP.format].xhtml( data => data );




// POST
// UPDATE
// DELETE

Object.defineProperties( String.prototype, {
    '$': {
        get: function()
        {
            return Array.from( document.querySelectorAll( ''+this ) )
            
        }
    },
    '_': {
        get: function()
        {
            var n = document.createELement( 'n' );
            n.innerHTML = ''+this;
            return n.childNodes;
        }
    }
    ,
    'json': {
        get: function()
        {
            return JSON.parse( ''+this )
        }
    }
    
})

// On exécute la méthode
HTTP(mdnAPI)
  .get(payload)
  .then(callback.success)
  .catch(callback.error);

// Une alternative qui appelle la méthode et permet de gérer le rejet de la promesse différemment
HTTP(mdnAPI) 
  .get(payload) 
  .then(callback.success, callback.error);

// Une autre alternative pour la gestion du rejet de la promesse
HTTP(mdnAPI) 
  .get(payload) 
  .then(callback.success)
  .then(undefined, callback.error);
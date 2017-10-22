
// Promess: Promise + change

Symbol.promess = Symbol`Promess`;
Object.defineProperty( Function.prototype, Symbol.promess, {get: function(){return new Promess(this)} } )
class Promess extends Promise {
    constructor( f )
    {
        super( f )
        // debugger;
        let res = /^(\(*(.*?)\)*\s*=>)|(function\s*(\w*\s*)+\((.*?)\)\s*\{)/.exec( f.toString() )
        res = typeof res[2] !='undefined' ? res[2] : res[5]
        let args = res.split(',').map( s=> s.trim() )
        
        args.map( name=> this[name] = function(){return this} )
        // 
        // /^()/.exec( f.toString() )
        console.log( args )
    }
    test(){console.log('ok')}
}

// Function.prototype.change = Function.prototype.then = function(f)
// {
//     console.info(f);
//     this[Symbol`promises`];
//     return this;
    
// }

var promis;


promis = new Promess( done => setTimeout(done,1000,"Coucou") )
             .done( alert );

promis = (function( done, fail, progress )
         {
            setTimeout( progress, 1000, Date.now() );
            setTimeout( done, 10000, "Fini !" );
         })
         [Symbol.promess]
            .progress( console.log.bind(console) )
            .fail( console.error.bind(console) )
            .done( console.info.bind(console) )


promis = ( done => setTimeout(done,1000,"Coucou") )
         [Symbol.promess]
            .done( alert )



;((finish,cant,pedding) => {
    setTimeout( pedding, 1000 , Date.now() );
    setTimeout( finish, 10000 , "Coucou" );
})
[Symbol.promess]
    .pedding( console.log.bind(console) )
    .cant( console.error.bind(console) )
    .finish( alert )



;((done,fail,change) => (
    setTimeout( change, 1000, Date.now() )
  , setTimeout( done, 10000, "Coucou" )
))
[Symbol.promess]
    .change( console.log.bind(console) )
    .fail( console.error.bind(console) )
    .done( alert )


;function GET( url, args )
{
    return ( (loaded,reject,change,progress) => {
        // Instantiates the XMLHttpRequest
        var xhr = new XMLHttpRequest();
        var uri = url;

        if (args) {
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

        xhr.onreadystatechange = function(e) {
            progress(e.position / e.totalSize)
        }
        xhr.onprogress = function(e) {
            progress(e.position / e.totalSize)
        }
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // Performs the function "loaded" when this.status is equal to 2xx
            loaded(this.response);
          } else {
            // Performs the function "reject" when this.status is different than 2xx
            reject(this.statusText);
          }
        };
        xhr.onerror = function () {
          reject(this.statusText);// e.target.status
        };
        xhr.open(method, uri, true);
        xhr.send();
    })
    [Symbol.promess]
}

// B-> Here you define its functions and its payload
var mdnAPI = 'https://developer.mozilla.org/en-US/search.json';
var payload = {
  'topic' : 'js',
  'q'     : 'Promise'
};

var callback = {
  success: function(data) {
    console.log(1, 'success', JSON.parse(data));
  },
  error: function(data) {
    console.log(2, 'error', JSON.parse(data));
  }
};
// End B

GET`https://developer.mozilla.org/en-US/search.json`
	.progress()
	.loaded()

GET( mdnAPI )
    .start( url => (
        myProgressBar.visible = true
      , myProgressBar.title = url
      , myProgressBar.percent = 0
    ))
    .progress( percent => ( myProgressBar.percent = percent ) )
    .progress( percent => ( myProgressBar.percent = percent ) )




// A-> $http function is implemented in order to follow the standard Adapter pattern
function $http(url){
 
  // A small example of object
  var core = {

    // Method that performs the ajax request
    ajax: function (method, url, args) {

      // Creating a promise
      var promise = new Promise( function (resolve, reject) {

        // Instantiates the XMLHttpRequest
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
            // Performs the function "resolve" when this.status is equal to 2xx
            resolve(this.response);
          } else {
            // Performs the function "reject" when this.status is different than 2xx
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

  // Adapter pattern
  return {
    'get': function(args) {
      return core.ajax('GET', url, args);
    },
    'post': function(args) {
      return core.ajax('POST', url, args);
    },
    'put': function(args) {
      return core.ajax('PUT', url, args);
    },
    'delete': function(args) {
      return core.ajax('DELETE', url, args);
    }
  };
};
// End A

// B-> Here you define its functions and its payload
var mdnAPI = 'https://developer.mozilla.org/en-US/search.json';
var payload = {
  'topic' : 'js',
  'q'     : 'Promise'
};

var callback = {
  success: function(data) {
    console.log(1, 'success', JSON.parse(data));
  },
  error: function(data) {
    console.log(2, 'error', JSON.parse(data));
  }
};
// End B

// Executes the method call 
$http(mdnAPI) 
  .get(payload) 
  .then(callback.success) 
  .catch(callback.error);

// Executes the method call but an alternative way (1) to handle Promise Reject case 
$http(mdnAPI) 
  .get(payload) 
  .then(callback.success, callback.error);

// Executes the method call but an alternative way (2) to handle Promise Reject case 
$http(mdnAPI) 
  .get(payload) 
  .then(callback.success)
  .then(undefined, callback.error);

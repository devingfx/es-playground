'use strict';

(function( global ){
    
    class XML extends Element {
    	constructor( node, mime )
    	{
			if( !node )
				node = '<root/>';
			if( typeof node == 'string' )
				node = (new DOMParser).parseFromString( node, mime||'text/xml').documentElement;
			
			return Object.setPrototypeOf( node, XML.prototype );
    	}
    	
    	text()
    	{
    		return Array.from(this.children).map( n => n.textContent )
    	}
    	
    	hasSimpleContent()
    	{
    		return !Array.from(this.children).length;
    	}
    	
    	hasComplexContent()
    	{
    		return !this.hasSimpleContent();
    	}
    	
		attributes()
		{
			return this.attributes
		}

		children()
		{
			return this.children
		}

		comments()
		{
			return Array.from(this.childNodes).filter(n=>n.nodeType==8)
		}

		toString()
		{
			return this.textContent
		}

		toXMLString()
		{
			return this.outerHTML
		}
    }
    
    /**
     * ignoreComments : Boolean
     * [static] Determines whether XML comments are ignored when XML objects parse the source XML data.
     */
    XML.ignoreComments = false
  	
    /**
     * ignoreProcessingInstructions : Boolean
     * [static] Determines whether XML processing instructions are ignored when XML objects parse the source XML data.
     */
  	XML.ignoreProcessingInstructions = false;
  	
    /**
     * ignoreWhitespace : Boolean
     * [static] Determines whether white space characters at the beginning and end of text nodes are ignored during parsing.
     */
  	XML.ignoreWhitespace = false;
  	
    /**
     * prettyIndent : int
     * [static] Determines the amount of indentation applied by the toString() and toXMLString() methods when the XML.prettyPrinting property is set to true.
     */
  	XML.prettyIndent = 1;
  	
    /**
     * prettyPrinting : Boolean
     * [static] Determines whether the toString() and toXMLString() methods normalize white space characters between some tags.
     */
  	XML.prettyPrinting = true;
    
    
    
    
    class XMLList extends Array {
    	constructor( node )
    	{
			super(  )
    	}
    	
    	text()
    	{
    		return this._children.map( n => n.textContent )
    	}
		
		attributes()
		{
			return this._children.map( n => n.attributes )
		}

		children()
		{
			return this._children.map( n => n.children )
		}

		comments()
		{
			return this._children.map( n => Array.from(n.childNodes).filter(n=>n.nodeType==8) )
		}

		toString()
		{
			return this._children.map( n => n.textContent )
		}

		toXMLString()
		{
			return this._children.map( n => n.outerHTML )
		}
    }
    
    var e4x = function e4x()
    {
        var tpl = ( e4x.isTpl( arguments ) ? e4x.combine( ...arguments ) : arguments[0] ).trim();
        // var tpl = e4x.combine( ...arguments ).trim();
//         console.log(arguments);
        
        var node = (new DOMParser).parseFromString( tpl,'text/xml').documentElement;
        
        // return ( node );
        return new e4x.Proxy( node );
    }
    e4x.isTpl = function( args )
    {
    	return Array.isArray(args[0]) && args.length == args[0].length;
    }
    e4x.sym  = Symbol`e4x`;
    e4x.XML = XML;
    e4x.XMLList = XMLList;
    e4x._e4x = class e4xProxy extends Function {
    	constructor( node )
    	{
			super();
			this._children = node instanceof NodeList ? Array.from( node ) : Array.isArray(node) ? node : [node];
        
			Object.defineProperty( this, 'length', {value:()=> this._children.length})
    	}
    	text()
    	{
    		return this._children.map( n => n.textContent )
    	}
		
		attributes()
		{
			return this._children.map( n => n.attributes )
		}

		children()
		{
			return this._children.map( n => n.children )
		}

		comments()
		{
			return this._children.map( n => Array.from(n.childNodes).filter(n=>n.nodeType==8) )
		}

		toString()
		{
			return this._children.map( n => n.textContent )
		}

		toXMLString()
		{
			return this._children.map( n => n.outerHTML )
		}

    }
    
    
    e4x.Proxy = function( node )
    {
        // var F = new e4x._e4x( node );
//         F._children = node instanceof NodeList ? Array.from( node ) : Array.isArray(node) ? node : [node];
//         console.log(F._children);
// 		F.text = ()=> F._children.map( n => n.textContent )
// 		Object.defineProperty( F, 'length', {value:()=> F._children.length})
// 		F.length = ()=> F._children.length
// 		F.attributes = ()=> F._children.map( n => n.attributes )
// 		F.children = ()=> F._children.map( n => n.children )
// 		F.comments = ()=> F._children.map( n => Array.from(n.childNodes).filter(n=>n.nodeType==8) )
// 		F.toString = ()=> F._children.map( n => n.textContent )
// 		F.toXMLString = ()=> F._children.map( n => n.outerHTML )

        return new Proxy(  new e4x._e4x( node ), {
            get: function( o, prop )
            {
//                 console.log( 'get: %s', prop );
                var isSymbol;
                try{''+prop}catch(e){isSymbol = e.message=="Cannot convert a Symbol value to a string"}
                
                // [3]
				if( !isSymbol && !isNaN(parseInt(prop)) )
                	return o._children[prop];
				
                if( o.hasOwnProperty(prop) || isSymbol || !!o[prop] )
                	return o[prop];
                
                if( prop[0] == '$' )
                	prop == '$'
                var res = [];
                o._children.map( n => {
                    try{
                        res = res.concat( Array.from(n.querySelectorAll(prop)) )
                    }catch(e){console.error(e)}
                    
                });
//                 return o[prop];
//                 return ( res )
// 				if( res.length == 1 )
// 					return e4x.XML.prototype.hasComplexContent.apply( res[0] ) ? e4x.Proxy(res[0]) : res[0].textContent;
                return new e4x.Proxy(res);
            }
//           , set: function( o, prop, v )
//             {
//                 console.log( 'set: %s = %o', prop, v )
                
//             }
          , apply: function( o, ctx, args )
            {
                console.log( 'call: ()', ctx, args, e4x.isTpl(args) )
                e4x.isTpl(args) && e4x.combine.apply( null, args ).trim()
            }
        })
    }
    e4x.combine = function( ss, ...a )
    {
        ss = ss.map ? ss : [ss];
        !ss.map && (ss = [ss]);
        return ss.map( (s,i) => s + (typeof a[i] != 'undefined' ? a[i] : '') )
                                .join('')
    }
    
    global.x = e4x;
	global.XML = e4x.XML;
    global.XMLList = e4x.XMLList;
    global.root = e4x.Proxy( document.documentElement )
    
})( window )






// html = document.documentElement
		// [Mutant.symbol]( lib.dom )


// html.body.div[o=>o.classList.has('aze')]
// html.body.div`classList.has('aze')`
// gens.personne`age > 40`







/* draft e4x


collection.SELECT.FROM(collection).WHERE[`id == ${obj.id}`]

collection.book.(@isdn > 9843).title
collection.book`@isdn > 9843`.title
collection.book[`@isdn > 9843`].title

collection.book..@lang
collection.book._.$lang
collection.book['..'].$lang


// From: https://developer.mozilla.org/fr/docs/JavaScript_Guide/Traitement_de_XML_avec_E4X

var langages = x`<langages type="dynamique">
   <lang>JavaScript</lang>
   <lang>Python</lang>
 </langages>`;

alert(langages.$type); // Affiche "dynamique"
langages.$type = "agile";
alert(langages.$type); // Affiche "agile"
alert(langages.toString());
/* Affiche :
<langages type="agile"><lang>JavaScript</lang><lang>Python</lang></langages>
* /


var personne = x`<personne>
  <nom>Jean Dupont</nom>
  <aime>
    <os>Linux</os>
    <navigateur>Firefox</navigateur>
    <langage>JavaScript</langage>
    <langage>Python</langage>
  </aime>
</personne>`;

alert(personne.nom); // Jean Dupont
alert(personne['nom']); // Jean Dupont
alert(personne.aime.navigateur); // Firefox
alert(personne['aime'].navigateur); // Firefox
alert(personne.aime.langage.length()); // 2
alert(personne.aime.$.length()); // 4
alert(personne._.$.length()); // 11
alert(personne.nom.text()); // Jean Dupont
var xml = personne.toXMLString(); // Une chaîne contenant le XML
var copiePersonne = personne.copy(); // Une copie profonde de l'objet XML
var enfant = person.child(1); // Le second nœud enfant ; dans ce cas l'élément <aime>


var langs = langages.lang;
alert(langages.lang.length());

for (var i = 0; i < langages.lang.length(); i++) {
     alert(langages.lang[i].toString());
 }


for each (var lang in langages.lang) {
     alert(lang);
 }


var xmllist = x`<>
   <lang>JavaScript</lang>
   <lang>Python</lang>
 </>`;

// langages.lang += <lang>Ruby</lang>; // Error !! must polyfill that
langages.lang.add( x`<lang>Ruby</lang>` ); // Error !! must polyfill that

var langages = x`<langages>
   <lang>JavaScript</lang>
   <lang>Python</lang>
 </langages>`;
 
 var lang = langages.lang;
 alert(lang.length()); // Affiche 2
 
langages.lang.add( x`<lang>Ruby</lang>` );
 alert(lang.length()); // Affiche toujours 2
 
 lang = langages.lang; // Recrée la XMLList
 alert(lang.length()); // Affiche 3



var html = x`<html>
  <p id="p1">Premier paragraphe</p>
  <p id="p2">Second paragraphe</p>
</html>`;

alert(html.p.[`@id == "p1"`]); // Affiche "Premier paragraphe"


var gens = x`<gens>
  <personne>
    <nom>Pierre</nom>
    <age>32</age>
  </personne>
  <personne>
    <nom>Paul</nom>
    <age>46</age>
  </personne>
</gens>`;

alert(gens.personne[`nom == "Paul"`].age); // Affiche 46

function plusde40(i) {
    return i > 40;
}

alert(gens.personne[`plusde40(parseInt(age))`].nom); // Affiche Paul




default xml namespace = "http://www.w3.org/1999/xhtml";
// Il n'est plus nécessaire de spécifier l'espace de noms dans la balise html
var xhtml = x`<html><head><title></title></head><body>
            <p>text</p></body></html>`;
alert(xhtml.head);


// Manuellement


var xhtml = x`<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>Démo de SVG intégré</title>
	</head>
	<body>
		<h1>Démo de SVG intégré</h1>
		<svg xmlns="http://www.w3.org/2000/svg" 
			viewBox="0 0 100 100">
			<circle cx="50"
				cy="50"
				r="20"
				stroke="orange"
				stroke-width="2px"
				fill="yellow" />
		</svg>
	</body>
</html>`;

alert(xhtml.name().localName); // Affiche "html"
alert(xhtml.name().uri); // Affiche "http://www.w3.org/1999/xhtml"


var svgns = new Namespace('http://www.w3.org/2000/svg');

var svg = xhtml._[`${svgns}::svg`];
var svg = xhtml._`${svgns}::svg`;
alert(svg); // Affiche la portion <svg> du document


*/
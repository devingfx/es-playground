'use strict';

(function( global ){
    
    


// ES6 playground //

class toto {}
class toto2 {}
toto2.toString = _ => `[Class ns.pack.Toto]`

// All this is ok and serialized as  string
var substitute = 'who'
  , o = {
        [-1]      :1
    ,   [[2,,5]]  :1
    ,   [o=>o]    :1
    ,   [e=>e.preventDefault()]    :1
    ,   [ o => o.prop == true ]    :1
    ,   [ (o,i) => i > 42 ]    :1
    ,   [toto]    :1
    ,   [toto2]    :1
    ,   [/a/]    :1
    ,   [/<(.*?)>/g]    :1
    ,   [`whatever `]    :1
    ,   [`with ${substitute}`]    :1
    ,   [``]    :1
    }
  ;





//https://github.com/sindresorhus/proxy-fun/blob/master/examples/smart-delete.js

// var friends = overrideDelete({
//   Vanessa: 'Copycat', Neena: 'Domino'
// });

// console.log(/^van/ in friends) //=> true
// console.log(delete friends[/^N\w+/]); //=> true
// console.log(delete friends[/^nathan/]); //=> false
// console.log(friends); //=> { Vanessa: 'Copycat' }

// function overrideDelete (obj) {
//   function toRegex (str) {
//     return new RegExp(str.substring(1, str.length - 1), 'i');
//   }
//   return new Proxy(obj, {
//     deleteProperty(target, property) {
//       var regex = toRegex(property);
//       const result = Object.keys(target).map((key) =>
//         regex.test(key) ? Reflect.deleteProperty(target, key) : false
//       );
//       return result.some(i => !!i);
//     },
//     has(target, property) {
//       var regex = toRegex(property);
//       return Object.keys(target).some((key) => regex.test(key));
//     },
//   });
// }

// var foo = overrideDelete({
//   someString: 1, barFoo: 2, anotherSomeString: 3
// });
// console.log('somestring' in foo); //=> true
// console.log('someString' in foo); //=> true

// function overrideDelete (obj) {
//   return new Proxy(obj, {
//     has(target, property) {
//       return Object.keys(target).some((key) =>
//         key.toLowerCase() === property.toLowerCase());
//     },
//   });
// }







// var  arr = betterArray([0, 1, 2, 3, 4, 5, 6, 7]);

// console.log(arr[-1]); //=> 7
// console.log(arr[[2, 5]]); //=> [ 2, 5 ]
// console.log(arr[[2, -2, 1]]); //=> [ 2, 6, 1 ]
// console.log(arr[[2,,5]]); //=> [ 2, 3, 4, 5 ]
// console.log(arr[[-2,,3]]); //=> [ 6, 7, 0, 1, 2, 3 ]
// console.log(arr[[0,,2,5]]); //=> [ 0, 1, 2, 3, 5 ]
// console.log(arr[[0,,2,4,,-1]]); //=> [ 0, 1, 2, 4, 5, 6, 7 ]
// console.log(arr[[-3,,-1]]); //=> [ 5, 6, 7 ]

// function betterArray (arr) {
//   return new Proxy(arr, {
//     get (target, property, receiver) {
//       const range = getRange(property);
//       const indices = range ? range : getIndices(property);
//       const values = indices.map(function (index) {
//         const key = index < 0 ? String(target.length + index) : index;
//         return Reflect.get(target, key, receiver);
//       });
//       return values.length === 1 ? values[0] : values;
//     }
//   });
//   // ....

//   function getRange (str) {
//     var range = []
//       , loop = (s,e) => { let arr=[]; while(arr.push(s++) < e); return arr }
//       , args = str.split(',')
//                 .map( v => v == '' ? null : +v )
//     // if (typeof end === 'undefined') return false;
    
//     args.map( (v,i) => v === null ? args[i-1]+1 to args[i+1]-1 range.concat() : range.push(v) )
//     debugger;
//     // let range = [];
//     // for(let i = ranges[0]; i < end; i++) {
//     //   range = range.concat(i);
//     // }
//     // return range;
//   }

//   function getIndices (str) {
//     return str.split(',').map(Number);
//   }
// }

    




/* draft e4x

negative array
function NArray(arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError('Expected an array');
	}

	return new Proxy(arr, {
		get: function (target, name) {
			var i = +name;
			return target[i < 0 ? target.length + i : i];
		},
		set: function (target, name, val) {
			var i = +name;
			return target[i < 0 ? target.length + i : i] = val;
		}
	});
};
infinite array
function iArray(arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError('Expected an array');
	}

	return new Proxy(arr, {
		get: function (target, name) {
			var i = +name;
			return target[i < 0 ? target.length + i : i];
		},
		set: function (target, name, val) {
			var i = +name;
			return target[i < 0 ? target.length + i : i] = val;
		}
	});
};
// adds negative array index support to any passed array
var unicorn = NArray(['pony', 'cake', 'rainbow']);

// get the last item by using an negative index
console.log(unicorn[-1]);
//=> rainbow

// OMG, YES!


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

})(this)
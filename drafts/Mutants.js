"use strict";
Proxy.prototype = {}; // Bug: chrome Proxy do not have a prototye so you can't extend it without.

window.log = window.log || (function(){var l=o=>o; l.I=l.E=l.I=l.G=l;return l})()

function getCompiledFunction (key) {
  try {
	return eval(key);
  } catch (ex) {
  }
}
// function toRegex (str) {
//   if (str.substr(0, 1) === '/' && str.substr(-1) === '/') {
//	 return new RegExp(str.substring(1, str.length - 1), 'i');
//   }
//   return void 0;
// }



class Mutant extends Proxy {
	constructor( value )
	{
		var base = typeof value != 'undefined' ? value : {};
		let proxy 
		// var base = {
		// };
//		 Object.defineProperties( base, {
//			 [Mutant.get]: {set: v=> this[Mutant.getters].push(v) },
//			 [Mutant.set]: {set: v=> this[Mutant.setters].push(v) }
//		 });
		return proxy = super( base, {
			// toto: ()=>43,
			// [Mutant.value]: value,
			[Mutant.getters]: [],
			set [Mutant.get]( v )
			{
				v && this[Mutant.getters].push(v)
			},
			get [Mutant.get]()
			{
				return v=> ( this[Mutant.get] = v, proxy )
			},
			
			[Mutant.setters]: [],
			set [Mutant.set]( v )
			{
				v && this[Mutant.setters].push(v)
			},
			get [Mutant.set]()
			{
				return v=> ( this[Mutant.set] = v, proxy )
			},
			
			get: function( base, prop )
			{
				log`${this[Mutant.getters]}o`;
				log.I`${'background:blueviolet;color:white;font-size:1.2em'}cMutant.get${''}c
				Try to get ${prop}o on ${base}o`
				//   console.info('%cMutant.get%c Try to get %o on %o','background:indigo;color:white;font-size:1.2em','', prop, base );
				if( typeof base == 'undefined' )
					log.I`can't get ${prop}o of ${base}o`;
				
				var key, type;
				if( isSym(prop) )
					return Reflect.has( base, prop )
							? Reflect.get( base, prop )
							: Reflect.get( this, prop )
				else if( isNum(prop) )
				{
					key = Number(prop);
					type = Number;
				}
				else if( key = isArr(prop) )
					type = Array;
				else if( key = isReg(prop) )
					type = RegExp;
				else if( key = isFun(prop) )
					type = Function;
				else if( key = isStr(prop) )
					type = String;
				
				if( type )
				{
					var getters = this[Mutant.getters]
								.map( getter=> getter[type] )
								.filter( o=> typeof o != 'undefined' )
					var res = getters.map(getter=> getter(base,key) )
								.filter( o=> typeof o != 'undefined' )
					  
					if( res.length ) return res[0]
					if( getters.length ) return 0[0]
				}
				return Mutant.lib.defaultGet( base, prop )
				// if( Reflect.has(o,p) )
				// 	return Reflect.get(o,p)
				// debugger;
				// var res = this[Mutant.getters]
				//		 .concat(Mutant.lib.defaultGet)
				//			 .map( f=> f.apply(base, [base, prop]))
				
				// console.log(res);
				// for(var v, i=res.length; v = res[--i];)
				//	 if( typeof v != 'undefined' )
				//		 return v;
				
				// return Mutant.lib.defaultGet( base[Mutant.value], prop );
				
				//   test(p) > fn()
				// return Reflect.get( base[Mutant.value], prop );
			},
			set: function( base, prop, value )
			{
				log.I`${'background:blueviolet;color:white;font-size:1.2em'}cMutant.set${''}c
				Try to set ${prop}o on ${base}o`
				//   console.info('%cMutant.get%c Try to get %o on %o','background:indigo;color:white;font-size:1.2em','', prop, base );
				
				if( isSym(prop) )
					return Reflect.has( this, prop )
							? Reflect.set( this, prop, value )
							: Reflect.set( base, prop, value )
				
				// if( prop == Mutant.get )
				// 	this[Mutant.get] = value;
				// if( prop == Mutant.set )
				// 	this[Mutant.set] = value;
				
				//   test(p) > fn()
				// typeof base[Mutant.value] != 'undefined'
				return Reflect.set( base, prop, value );
			}
		});
	}
}
Mutant.symbol = Symbol`mutation`;
Mutant.value = Symbol`value`;
Mutant.getters = Symbol`getters`;
Mutant.setters = Symbol`setters`;
Mutant.get = Symbol`get`;
Mutant.set = Symbol`set`;
Mutant.index = Symbol`index`;

Mutant.lib = {
	defaultGet: (o,p)=>Reflect.get(o,p),
	
	// From https://github.com/sindresorhus/proxy-fun/blob/master/examples/smart-delete.js
	regexSearch: {
		get: (o,p)=> o 
	  , deleteProperty(target, property)
		{
			var regex = this.toRegex(property);
			const result = Object.keys(target).map((key) =>
				regex.test(key) ? Reflect.deleteProperty(target, key) : false
			);
			return result.some(i => !!i);
		}
	  , has(target, property)
		{
		  var regex = this.toRegex(property);
		  return Object.keys(target).some((key) => regex.test(key));
		}
	  , toRegex (str)
		{
			return new RegExp(str.substring(1, str.length - 1), 'i');
		}
	}

	
}


Object.defineProperty( Object.prototype, Mutant.symbol, {get: function()
{
	return function( o )
	{
		return new Proxy( this, o )
	}
}})

function isSym(prop)
{
	// return prop.toString().substr(0,7) == "Symbol("
	return typeof prop == 'symbol'
}
function isNum(prop)
{
	return !isNaN(prop) && prop !== ''
}
function isArr(prop)
{
	if( typeof prop == 'string' && prop.length == 0 ) return false;
	if( typeof prop == 'string' && !isNaN(prop) ) return false;
	if( typeof prop == 'string' && prop.indexOf(',') == -1 ) return false;
	if( isFun( prop ) ) return false;
	var a;
	try {
		a = eval('['+prop+']')
	}catch(e){}
	if( a ) return a;
	return false;
}
function isStr(prop)
{
	return typeof prop == 'string' ? prop : false
}
// function isReg(prop)
// {
//	 return /^\/.*\/[a-z]*$/.test( prop )
// }
function isReg(prop)
{
	if( isStr(prop) )
	{
		let pp = prop.split('/')
		  , mod = pp.pop();
		pp.shift();
		if( prop[0] === '/' && pp.length ){
			return new RegExp(pp.join('/'), mod );
		}
	}
	return void 0;
}
function isFun(prop)
{
	var a;
	try {
		a = eval('('+prop+')')
	}catch(e){}
	if( a && typeof a == 'function') return a;
	return false;
}

class OMNI {
	constructor()
	{
		return new Proxy( function ObjetMagicNonIdentifie(){}, {
			
			// Une trappe pour l'appel d'une fonction.
			apply( target, prop, args )
			{
				// if( isTpl(args) )
			}
			// Une trappe pour l'opérateur new.
		  , construct( target, prop, args ) {}
			// Une trappe pour l'accès aux valeurs des propriétés.
		  , get ( target, prop )
			{
				if( isSym(prop) ) return Reflect.get( target, prop );
				if( isNum(prop) ) return Reflect.get( target, prop );
				if( isArr(prop) ) return Reflect.get( target, prop );
				if( isStr(prop) ) return Reflect.get( target, prop );
				if( isReg(prop) ) return Reflect.get( target, prop );
				if( isFun(prop) ) return Reflect.get( target, prop );
			}
			// Une trappe pour la définition des valeurs des propriétés.
		  , set( target, prop, value )
			{
				if( isSym(prop) ) return Reflect.set( target, prop );
				if( isNum(prop) ) return Reflect.set( target, prop );
				if( isArr(prop) ) return Reflect.set( target, prop );
				if( isStr(prop) ) return Reflect.set( target, prop );
				if( isReg(prop) ) return Reflect.set( target, prop );
				if( isFun(prop) ) return Reflect.set( target, prop );
			}
			// Une trappe pour l'opérateur in.
		  , has( target, prop ) {}
			// Une trappe pour Object.getOwnPropertyNames.
		  , ownKeys( target ) {}
			// Une trappe pour l'opérateur delete.
		  , deleteProperty( target, prop ) {}
			// Une trappe pour Object.getPrototypeOf.
		  , getPrototypeOf( target ){}
			// Une trappe pour Object.setPrototypeOf.
		  , setPrototypeOf( target, proto ){}
			// Une trappe pour Object.isExtensible.
		  , isExtensible( target ){}
			// Une trappe pour Object.preventExtensions.
		  , preventExtensions( target ){}
			// Une trappe pour Object.defineProperty.
		  , defineProperty( target, prop, desc ){}
			// Une trappe pour Object.getOwnPropertyDescriptor.
		  , getOwnPropertyDescriptor( target, prop ){}
		})
	}
}





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
//	 return new RegExp(str.substring(1, str.length - 1), 'i');
//   }
//   return new Proxy(obj, {
//	 deleteProperty(target, property) {
//	   var regex = toRegex(property);
//	   const result = Object.keys(target).map((key) =>
//		 regex.test(key) ? Reflect.deleteProperty(target, key) : false
//	   );
//	   return result.some(i => !!i);
//	 },
//	 has(target, property) {
//	   var regex = toRegex(property);
//	   return Object.keys(target).some((key) => regex.test(key));
//	 },
//   });
// }

// var foo = overrideDelete({
//   someString: 1, barFoo: 2, anotherSomeString: 3
// });
// console.log('somestring' in foo); //=> true
// console.log('someString' in foo); //=> true

// function overrideDelete (obj) {
//   return new Proxy(obj, {
//	 has(target, property) {
//	   return Object.keys(target).some((key) =>
//		 key.toLowerCase() === property.toLowerCase());
//	 },
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
//	 get (target, property, receiver) {
//	   const range = getRange(property);
//	   const indices = range ? range : getIndices(property);
//	   const values = indices.map(function (index) {
//		 const key = index < 0 ? String(target.length + index) : index;
//		 return Reflect.get(target, key, receiver);
//	   });
//	   return values.length === 1 ? values[0] : values;
//	 }
//   });
//   // ....

//   function getRange (str) {
//	 var range = []
//	   , loop = (s,e) => { let arr=[]; while(arr.push(s++) < e); return arr }
//	   , args = str.split(',')
//				 .map( v => v == '' ? null : +v )
//	 // if (typeof end === 'undefined') return false;
	
//	 args.map( (v,i) => v === null ? args[i-1]+1 to args[i+1]-1 range.concat() : range.push(v) )
//	 debugger;
//	 // let range = [];
//	 // for(let i = ranges[0]; i < end; i++) {
//	 //   range = range.concat(i);
//	 // }
//	 // return range;
//   }

//   function getIndices (str) {
//	 return str.split(',').map(Number);
//   }
// }

	

/*
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
*/
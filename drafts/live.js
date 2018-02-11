Symbol.bindables = Symbol('Symbol.bindables');
Symbol.spies = Symbol('Symbol.spies');

function Property( desc )// TODO: ( name, ...types )
{
	console.log('Property( %o )', desc );
	desc = desc || {};
	var F = function( v )
	{
		if( arguments.length && F.value != v )
		{
			let old = F.value;
			F.value = desc.set && desc.set( v ) || v;
			F.fire(new CustomEvent('propertyChange',{detail:{old: old, new: F.value}}));
		}
		return desc.get && desc.get() || typeof F.value == 'undefined' ? '' : F.value;
	}
	F.value = desc.value;
	F[Symbol.spies] = [];
	// if( desc.set )
	// 	desc.set = desc.set.bind( F.value );
	// if( desc.get )
	// 	desc.get = desc.get.bind( F.value );
	F.on = f => (F[Symbol.spies].push( f ), F)
	F.off = f => (!f ? F[Symbol.spies]=[] : F[Symbol.spies].splice( F[Symbol.spies].indexOf(f), 1 ), F)
	F.fire = e => (Object.defineProperty(e,'target',{get:()=>F}),F[Symbol.spies].map( lstn=> lstn(e) ), F)
	// F[org.schema.description] = desc.description;
	F.toString = function(){ return typeof F.value == 'undefined' ? '' : F.value.toString.apply(F.value, arguments) }
	F.toJSON =  ()=> `[[${F.value}]]`;
	F.valueOf = ()=> F.value;
	F[Symbol.toPrimitive] = type=> console.info('toPrimitive: %s',type) || type=='string' && typeof F.value != 'boolean' && !F.value ? '' : F.value;
	return F;
}
Property.listeners


function BindableProxy( target )
{
	if( target[Symbol.bindables] ) return target;
	
	let is = {};
	is[Array] = Array.isArray( target );
	// let binder = Property({value:target})
	// binder.on(e=>e.type=='propertyAdded' && binder.value[e.detail.key]= )
	// switch( typeof target )
	// {
		// case 'object':
			Object.defineProperty( target, Symbol.bindables, {value: Property({value:target}), enumerable: false});
			let proxy = new Proxy( target, {
				get: (o,p)=> {
					if( typeof p == 'symbol' ) return o[p];
					if( p == 'toJSON' ) return ()=>target;
					if( typeof target[p] == 'function' ) return o[p];
					if( Reflect.has( target[Symbol.bindables], `[[${p}]]` ) )
						return Reflect.get( target[Symbol.bindables], `[[${p}]]` )
					else if( Reflect.has(target, p) )
						return target[Symbol.bindables][`[[${p}]]`] = Property(Object.getOwnPropertyDescriptor(target, p))
					else
						return Reflect.get( target, p )
					
					
				},
				set: (o,p,v)=> {
					let exists = Reflect.has( target[Symbol.bindables], `[[${p}]]` );
					!exists
						&& (target[Symbol.bindables][`[[${p}]]`] = Property(Object.getOwnPropertyDescriptor(target, p)))
						// && (target[p] = v)
						&& target[Symbol.bindables].fire( new CustomEvent('propertyAdded', {detail: {key:p}}) )
					
					target[Symbol.bindables][`[[${p}]]`].on( e=> 
						target[Symbol.bindables].fire( new CustomEvent('propertyChange', {detail: {key:p, old:e.old, new:e.new}}) )
					)
					target[Symbol.bindables][`[[${p}]]`]( v );
				}
			})
			// for( var n in target ) proxy[n] = target[n];
	// 	break;
	// 	case 'function':
	// 		// target[Symbol.bindables] = Property({value: target})
	// 	break;
	// 	case 'boolean':
	// 	case 'number':
	// 	case 'string':
	// 	default:
	// 		target[Symbol.bindables] = Property({value: target})
	// 	break;
	// }
	return proxy;
}
BindableProxy.registerName = 'on'; // 'addEventListener';
BindableProxy.unregisterName = 'off'; // 'removeEventListener';
BindableProxy.launchName = 'fire'; // 'dispatchEvent'




function Bindable( target, prop, desc )// TODO: ( name, ...types )
{
	console.log('Bindable( %o, %o, %o )', target, prop, desc );
	if( arguments.length == 1 )
	{
		if( Bindable.isDescriptor(target) )
		{
			desc = target
			target = 0[0] // undefined
		}
		// if( typeof target == 'object' && Array.isArray(target) )
		// {}
		if( typeof target == 'object' )//&& !Array.isArray(target) )
		{
			// Object.defineProperty( target, Bindable.symbol, {value: [], enumerable: false});
			var privs = {};
			return new Proxy( target, {
				get:(o,p)=> {
					if( p === Bindable.symbol ) return o[Bindable.symbol];
					return privs[p]
							|| ( privs[p] = Bindable(Object.getOwnPropertyDescriptor(o, p)) )
					
				},
				set:(o,p,v)=> o[Bindable.symbol][p]( v )
			})
			// Object.getOwnPropertyNames( target )
			// 	.map( prop=> {
			// 		let propDesc = Object.getOwnPropertyDescriptor(target, prop);
			// 		if( propDesc.writable )
			// 		{
			// 			// Bindable( target, prop, propDesc )
			// 			var priv = target['_'+prop.toString()] = Bindable(propDesc);
			// 			propDesc.get = function(){return priv}
			// 			propDesc.set = function(v){return priv(v)}
			// 			Object.defineProperty(target, prop, propDesc);
			// 		}
			// 	})
		}
	}
	var F = function( v )
	{
		if(!arguments.length) return F.value;
		if( F.value != v )
		{
			let old = F.value;
			F.value = desc && desc.set && desc.set( v ) || v;
			F.fire({old: old, new: F.value});
		}
		return desc && desc.get && desc.get() || typeof v == 'undefined' ? '' : v;
	}
	F.value = desc && desc.value || target;
	F[Bindable.symbol] = [];
	if( desc )
	{
		if( desc.set )
			desc.set = desc.set.bind( F.value );
		if( desc.get )
			desc.get = desc.get.bind( F.value );
	}
	F.on = f => (F[Bindable.symbol].push( f ), F)
	F.off = f => (!f ? F[Bindable.symbol]=[] : F[Bindable.symbol].splice( F[Bindable.symbol].indexOf(f), 1 ), F)
	F.fire = e => (F[Bindable.symbol].map( lstn=> lstn(e) ), F)
	// F[org.schema.description] = desc.description;
	F.toString = function(){ return typeof F.value == 'undefined' ? '' : F.value.toString.apply(F.value, arguments) }
	F.valueOf = ()=> F.value;
	return F;
}
Bindable.symbol = Symbol.bindables;
Bindable.isDescriptor = function( obj )
{
	let description = "configurable enumerable writable value get set".split(' ');
	return typeof obj == 'object' && 
	Object.getOwnPropertyNames( obj )
		.filter( prop=> obj.hasOwnProperty(prop) )
		.every( prop=> description.indexOf(prop)!=-1 )
}

  
/**
 * live( ss:Array[String], bindables:Array[Property|Object] ):Node
 * 
 * You should not call this function directly, it is made to be used as template tag:
 * let myComp = live`<div class="foo-${navigator.language}"><b>${hello}</b> ${who} !</div>`
 * 
 * Transform any HTML string into real DOM Node replacing template string placeholders by their
 * values. If placeholders are bindable object, the markup is auto updated when object changes.
 * 
 * Placeholders can be Nodes, Arrays (TODO), Function, Property, BindableProxy (TODO), Class (TODO), each other
 * value type are seralized to string, taking care of undefined values returning empty string.
 * 
 * @param ss:Array[String] 					The strings array from es6 template string
 * @param bindables:Array[Property|Object] 	The values array from es6 template string
 * @return Node            					The generated live node
 */
const live = window.live = function live( ss )
{
	var bindables = Array.from(arguments).splice(1),
	    // Just replace substitutions by a placehodler
	    // <v-node> for "value node" or <x-node> for "extended node" 
	    // that can change the tagName live (ex: <${data.tag} id="foo">Hello world</${data.tag}> )
		html = ss.map( (str,i)=> {
			var rev = str.split('').reverse().join(''),
				next = ss[i+1] || '',
				nrev = next.split('').reverse().join('');
			
			if( (rev[0] == '<' && next[0] == ' ') ||
				(rev[0] == '/' && next[0] == '>') ) // is a tagName
				return str + (bindables[i] ? `x-node ${i}` : '');
			// if( />/.match(rev) )	
			// if( /"=/.match(rev) )	
			
			return str + (bindables[i] ? `<v-node ${i}></v-node>` : '');
		});
	
	// Renders the html string to dumb dom
	// return (new DOMParser).parseFromString( html, 'text/html' ).body.firstElementChild;
	var dom = (new DOMParser).parseFromString( '<body>'+html.join(''), 'text/html' ).body;
	
	// Add x-node's shadowroot that will render a new tag each time the tagnamme changes
	// TODO
	Array.from( dom.querySelectorAll('x-node') )
		.map( xnode=> {
			let i = +xnode.attributes[0].name;
			console.log('x-node', i, bindables[i])
			var sha = xnode.createShadowRoot();
			if( bindables[i][Symbol.spies] ){}
			else
				sha.innerHTML = `<${bindables[i]} ${Array.from(xnode.attributes).map(a=>a.name+'="'+a.value+'"').join(' ')}><content>`
		})
	
	/**
	 * workOnText( obj:Object, prop:String, bindables:Array[Property||Object] )
	 */
	function workOnText( obj, prop, bindables )
	{
		var target = obj
		if( target instanceof Attr )
			target = target.ownerElement
		var _value = obj[prop];
		var values = obj[prop].match(reg);	// "text <v-node x></v-node> text " 
		values = values.map( s=> +/\d+/.exec(s) )
					.map( function(ib,i) {
						if( bindables[ib][Symbol.spies] )
							bindables[ib].on(e=> {
								values[i] = e.detail.new || '';
								console.log('change:',ib, i, values[i]);
								setTimeout(values.update,100)
							})
						else if( typeof bindables[ib] == 'function' )
						{
							target.fn[live.__hid__] = bindables[ib];
							return `this.fn[${live.__hid__++}](event)`;
							// live[live.__hid__] = bindables[ib];
							// return `live[${live.__hid__++}](event)`;
						}
						return '' + (bindables[ib].value||bindables[ib]||'');
					})
		console.log('Text binding: %o', values);
		values.update = ()=> {
			let i = 0;
			obj[prop] = _value.replace( reg,
								  (s,$1)=> {
								  	console.log('Text binding update: %o, %o',obj ,values[i]);
								  	return values[i++];
								  }
						)
		}
		values.update();
	}
	
	// Find <v-node>s in attributes
	var reg = /<v-node\s(\d*)><\/v-node>/g;
	Array.from( dom.querySelectorAll('*') )
		.map( node=> {
			if( node instanceof HTMLScriptElement && reg.test(node.innerHTML) )
				workOnText( node, 'innerHTML', bindables )
			if( node instanceof HTMLStyleElement && reg.test(node.innerHTML) )
				workOnText( node, 'innerHTML', bindables )
			Array.from( node.attributes )
				.map( att=> {
					if( reg.test(att.value) )
					{
						workOnText( att, 'value', bindables )
						// att._value = att.value;
						// var values = att.value.match(reg);
						// values = values.map( s=> +/\d+/.exec(s) )
						//			 .map( function(i) {
						//				 if( bindables[i][Bindable.symbol] )
						//				 bindables[i].on(e=> {
						//					 values[i] = e.new;
						//					 console.log('change:',i, values[i]);
						//					 setTimeout(values.update,100)
						//				 })
						//				 else if( typeof bindables[i] == 'function' )
						//				 {
						//				 	live[live.__hid__] = bindables[i];
						//				 	return `live[${live.__hid__++}](event)`;
						//				 }
						//				 return '' + (bindables[i].value||bindables[i]||'');
						//			 })
						// console.log('genere:',values);
						// values.update = ()=> {
						// 	att.value = att._value
						   //				 .replace( reg,
						   //						   (s,$1)=> {
						   //						   	console.log('replace:',values[$1]);
						   //						   	return values[$1] ? values[$1] : '';
						   //						   }
						   //				 )
						// }
						// values.update();
					}
				})
		})
	
	// Fill v-nodes with the correponding values
	// and setup a listener if bindable
	bindables.length && 
	Array.from( dom.querySelectorAll('v-node') )
		.map( vnode=> {
			var i = +vnode.attributes[0].name;
			console.log('v-node',vnode, i, bindables[i]);
			
			if( Array.isArray(bindables[i]) )
				return bindables[i].map(obj=> obj instanceof Element && vnode.appendChild( obj ) )
				
			if( bindables[i] instanceof Element )
			{
				vnode.parentNode.insertBefore( bindables[i], vnode );
				return vnode.remove();
			}
			if( bindables[i][Symbol.spies] )
			{
				bindables[i].on( e=> (vnode.innerText = '' + (bindables[i]()||'') ) )
				vnode.data = bindables[i];
			}
			vnode.innerText = '' + ((bindables[i][Symbol.spies] ? bindables[i]() : bindables[i]) || '');
		})
	
	let result = dom.firstElementChild
	result.setAttribute('live','')
	result.live = true
	return result
}
/**
 * live.__hid__
 * @private
 * The unique increment referencing 
 */
live.__hid__ = 0;

// live.type = {}
// live.type.string = function(){}
// live.type.number = function(){}
// live.type.boolean = function(){}
// live.type.function = function(){}
// live.type.object = function(){}
// live.type.Array = function(){}
// live.type.Element = function(){}

/**
 * live.tpl( node:Node ):Function
 * 
 * @param node:Node The node from wich retreive the HTML content
 * @return Function The compiled function with signature fn() or fn({}) or fn(1,2,3,4)
 */
live.tpl = function( node )
{
	let isTpl = node.localName == 'template';
	var html = (isTpl ? node.innerHTML : node.outerHTML)
					.replace(/&lt;\$\{(.*?)&gt;/g,'<${$1>')
					.replace(/<!--\$\{(.*?)\}-->/g,'</${$1}>')
					.replace(/=&gt;/g,'=>');
	var tpl = new Function('',`
		for(var i = 0, l = arguments.length; i < l ; i++ )
			arguments['$'+i] = arguments[i]
		with( arguments )
		{
			if( typeof $0 != 'undefined' )
			{
				with( $0 )
					return live\`${html}\`
			}
			else
				return live\`${html}\`
		}
	`)
	return tpl
}

/**
 * live.init( root:Document ):void
 * 
 * Compiles <template live> nodes to a function returning a live`<innerHTML>` call.
 * And replace normal nodes with "live" attribute by its live`<outerHTML>` call.
 * 
 * @param root:Document The document where to search the nodes with "live" attribute
 * 						document is used if not defined. You must init ShadowRoot separately
 * 						because of non-crossing shadow boundary querySelectors.
 */
live.init = function( root )
{
	root = root || document
	Array.from( root.querySelectorAll('[live]') )
		.filter( node=> !node.live )
		.map( node=> {
			let isTpl = node.localName == 'template';
			let tpl = live.tpl(node)
			if( isTpl )
			{
				node.tpl = tpl
				node.id && ( window[node.id] = tpl )
			}
			else
			{
				node.parentNode.insertBefore(tpl(),node)
				node.remove()
			}
		})
}

// First init call
document.addEventListener('DOMContentLoaded', e=> live.init(document) )

export { live, Property, Bindable }

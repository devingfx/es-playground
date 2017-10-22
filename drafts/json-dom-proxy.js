function Mutant( obj = {} )
{
    //let list,dom = (ss,...pp)=>( Mutant._n.innerHTML = ss.map((s,i)=>s+(pp[i]||'')).join(''), list = Array.from(Mutant._n.children), list.length == 1 ? list[0] : list )
	let  dom = (ss,...pp)=>(new DOMParser).parseFromString(ss.map((s,i)=>s+(pp[i]||'')).join(''),'application/xml').documentElement
	
	var n, proxy, type = typeof obj
	type = type[0].toUpperCase() + type.slice(1)
	if( type == 'Object' && Array.isArray(obj) ) type = 'Array'
	switch(type)
    {
		case 'Object':
			n = dom`<${type}${obj.constructor!=Object?` type="${obj.constructor.name}"`:obj['@type']?` type="${obj['@type']}"`:''}/>`
			Object.keys(obj).map( name=> {
				let m = Mutant(obj[name]);
				m[Symbol.toPrimitive]().setAttribute('name',name);
				n.append(m[Symbol.toPrimitive]()) })
		break;
		case 'Array': 
			n = dom`<${type}/>`
			obj.map( val=> {let m = Mutant(val); n.append(m[Symbol.toPrimitive]()) })
		break;
        default: n = dom`<${type} value="${obj}"></${type}>`
    }
	n[Symbol.toPrimitive] = function( hint )
	{
		return hint == 'string' ?
			n.outerHTML
		: hint == 'number' ?
			n.children.length
		: n
	}
	proxy = new Proxy( n, {
		has(o,p){return o.querySelector(`[name="${p}"]`)},
		get(o,p){
			if( p === Symbol.toPrimitive ) return Reflect.get(o,p);
			return o.querySelector(`[name="${p}"]`).mutant
		},
		set(o,p,v){
			if( p in proxy )
            {
				!proxy[p][Symbol.toPrimitive]().children.length && proxy[p][Symbol.toPrimitive]().replaceWith(Mutant(v)[Symbol.toPrimitive]());
// 				!!o[p].children.length && Reflect.set(o,p,v)
				!!proxy[p][Symbol.toPrimitive]().children.length && Object.assign(proxy[p],v)
            }
			let n, type = typeof v;
			type = type[0].toUpperCase() + type.slice(1)
			if( type == 'Object' && Array.isArray(v) )
				type = 'Array'
			o.append(n=dom`<${type} name="${p}"/>`)
			//if( type == 'Array' ) v.map( o=> 
			//${type=='Array'?v.map(o=>).join(''):v}</${type}>`);
			console.log(type, n,n.localName, n.namespaceURI)
			return true
        }
	})
	//Object.assign( proxy, obj )
	n.mutant = proxy
	return proxy
}
// Mutant._n = document.createElement('n')

/** usage
var x = new Mutant({
	aze:42,
	qsd:34,
	foo:true, 
	arr:["aze",42,false], 
	activity:{
      "@context": "http://www.w3.org/ns/activitystreams",
      "@type": "Create",
      "actor": {
        "@type": "Person",
        "@id": "acct:sally@example.org",
        "displayName": "Sally",
		birth: new Date
      },
      "object": {
        "@type": "Note",
        "content": "This is a simple note"
      },
      "published": "2015-01-25T12:34:56Z"
	}
})
document.body.append( x[Symbol.toPrimitive] )
*/
/* css
@namespace j "";
Object {display: block}
	Object::before {content: "{"}
	Object::after {content: "}"}
Array {display: block}
	Array::before {content: "["}
	Array::after {content: "]"}
j|Number::after {content: attr(value)}
j|Number::before {content: attr(name)" :"}
j|Number {color: blue !important}
j|Boolean{color:purple !important}
j|Boolean::after {content:attr(value)}
j|Boolean::before {content:attr(name)" :"}

*/
function html(ss,...pp)
{
	let n = document.createElement('n')
	n.innerHTML = ss.map((s,i)=>s+(
		typeof pp[i] == 'undefined' ?
			''
		: typeof pp[i] == 'function' ?
			`<n>${pp[i]}</n>`
	// 		html.EVENT = []
	// `<n f ${i}>html.EVENT[${html.EVENT.push(pp[i])-1}](event)</n>`
	// 	: `<n ${i}>${pp[i]}</n>`
		: pp[i]
	)).join('')
	function findBindables( fn )
	{
		let words = fn.toString().replace(/^.*=>/,'').match(/\w+/g)
		// debugger;
		let vars = words && words.map( w=>{try{return eval(w)}catch(e){} })
					.filter( o=> o && (o.on || o.addEventListener) )
		
		return vars ? vars : []
	}
	// debugger;
	console.log(
	Array.from( n.querySelectorAll('*') )
		.map( n=> Array.from(n.attributes) )
		.filter( attrs=> attrs.some( att=>/<n>.*?<\/n>/.test(att.value) ) )
		.map( attrs=> attrs.map( att=> {
					att._nodes = Array.from( eval(`html\`${att.value.replace(/<n>(.*?)<\/n>/, '${$1}')}\``) )
					att.exec = ()=> {try{att.value = att._nodes.map(n=>n.textContent).join('')}catch(e){}}
					att._nodes.map( n=> n.addEventListener('change', e=> att.exec() ) )
					// att.exec = new Function('',
					// 	`try{
					// 		let nodes = html\`${att.value.replace(/<n>(.*?)<\/n>/, '${$1}')}\`
					// 		att.value = Array.from( nodes ).map(n=>n.textContent).join('')
					// 	}catch(e){}`
					// )
					att.exec()
					// console.log( findBindables( fn ) )
					// findBindables( fn )
						// .map( o=>o.onChange(n.exec))
					// return att
				})
		)
		// .map( attrs=> attrs.map( att=>{
		// 	let fn = eval(n.innerText)
		// 	n.innerHTML = ''
		// 	n.exec = ()=> {try{n.innerHTML = fn()}catch(e){}}
		// 	n.exec()
		// 	console.log( findBindables( fn ) )
		// 	findBindables( fn )
		// 		.map( o=>o.onChange(n.exec)) 
		// }))
	)
	Array.from( n.querySelectorAll('n') )
		.map( n=> {
			let fn = eval(n.innerText)
			n.innerHTML = ''
			n.exec = ()=> {try{n.innerHTML = fn();n.dispatchEvent(new Event('change'))}catch(e){}}
			n.exec()
			console.log( findBindables( fn ) )
			findBindables( fn )
				.map( o=>o.addEventListener('change',n.exec)) 
		})
	return n.childNodes
}
function Bindable( obj )
{
	obj.addEventListener = obj.on = (type,fn)=> {
		this._listeners = this._listeners || {}
		this._listeners[type] = this._listeners[type] || []
		this._listeners[type].push(fn) 
	}
	obj.removeEventListener = obj.off = (type,fn)=> {
		this._listeners
			&& this._listeners[e.type] ? 
				fn ? this._listeners[e.type].splice( this._listeners[e.type].indexOf(fn), 1 )
				: this._listeners[e.type] = []
			: null
	}
	obj.dispatchEvent = e=> this._listeners
							&& this._listeners[e.type]
							&& this._listeners[e.type].map( fn=> fn(e) )

	return obj
}


/* usage: 
var obj = Bindable({
	get aze(){ return this._aze },
	set aze(v){ this._aze = v; this.dispatchEvent(new Event('change')) }
})

var obj2 = {
	get aze(){ return this._aze },
	set aze(v){ this._aze = v; this.dispatchEvent(new Event('change')) }
}
Bindable( obj2 )

/* TODO
var obj3 = {
	aze: Bindable(42)
}

class Aze {
	@Bindable
	prop = 42
}
* /
document.body.append( ...html`<div class="aze-${e=>obj.aze}" onclick="${e=>e}"> ${e=>obj.aze.toFixed(2)}€ </div>` )
*/
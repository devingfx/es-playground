class Editor {

	constructor( data )
	{
		// debugger;
		this.pre = document.createElement('Editor');
		
		this.pre.innerHTML = 
			`<style>
				Editor {
					display: inline-block;
					font-family: monospace;
					white-space: pre;
					background: rgba(255,255,255,.6);
					box-shadow: -1px -1px 0 rgba(0,0,0,.3),1px 1px 0 rgba(255,255,255,0.5),inset 0 0 6px rgba(0,0,0,.3);
					padding: .5em;
				}
				Editor line {display:block;}
				*:focus {
					outline: none;
					background-color: white;
					box-shadow: 0 3px 10px rgba(0, 0, 0, .7);
				}
				String, Boolean, Number, Array, key { display: inline; }
				String { color: green }
					String:before { content: '"'; }
					String:after { content: '"'; }
				Boolean { color: blue }
				Number { color: blue }
				Array { color: orange }
					Array:before { content: "["; }
					Array:after { content: "]"; }
				Object {  }
					Object:before { content: "{"; }
					Object:after { content: "}"; }
				children {
					margin-left: 4em;
					display: block;
				}
				key {
					font-weight: bold;
				}
					key:before { content: '"'; opacity:0.5; }
					key::after { content: '":'; opacity:0.5; }
			</style>`;
			
		this.editable = Property({value:true});
		
		this.customStyles = {}
		// this.$el[0].innerHTML = `<header>${before}</header>` + this.stringify(data);
		document.body.setAttribute('spellcheck',"false");
		
		this.data = BindableProxy( data )
		this.pre.appendChild( this.transform(this.data) );
		
		Array.from( this.pre.querySelectorAll('[contenteditable]') )
			.map( node=> {
				node.addEventListener('keydown', e=> {
					e.key == 'Enter' && (e.preventDefault(),e.target.blur());
				})
				node.addEventListener('keyup', e=> {
					// e.key == 'Enter' && 
					e.target.querySelector('v-node').data( e.target.textContent );
				})
			})
		
	}
	
	transform( json )
	{
		var target = json[Symbol.spies] ? json.value : json;
		switch( typeof target )
		{
			case 'string': return live`<String contenteditable="${this.editable}" 
											   keydown="${e=>
											   		json(e.target.textContent)
											   }" 
											   value="${json}">${json}</String>`;
			case 'boolean': return live`<Boolean contenteditable="${this.editable}" value="${json}">${json}</Boolean>`;
			case 'number': return live`<Number contenteditable="${this.editable}" value="${json}">${json}</Number>`;
			case 'object': if( Array.isArray(target) )
								return live`<Array><children>${target.map( item=> this.transform(item) )}</children></Array>`;
							else
								return live`<Object type="${target['@type']||target.constructor.name}"><children>${
											Object.getOwnPropertyNames( target )
												.map( n=> typeof n != 'symbol' && live
				`<line><key contenteditable="${this.editable}" name="${n.toString()}">${n.toString()}</key>${this.transform(json[n])}</line>` )
		
	}</children></Object>`;
			// case 'function': if( json[Bindable.symbol] ) return this.transform(json.value);
		}
	}
}

class XMLTree extends HTMLElement {
	XMLTree()
	{
		this[XMLTree.Symbol] = this.createShadowRoot()
		this[XMLTree.Symbol].append( live`<style>@import '../xml-tree/xml-tree.css';</style>` )
		
		var childs = Array.from( this.children )
		childs.filter( n => n.localName == 'style' )
			.map( n=> this[XMLTree.Symbol].appendChild(n) )
		childs.filter( n => n.localName != 'style' )
			.map( n=> this[XMLTree.Symbol].appendChild( XMLTree.tpl_(n) ) )
		
		let m = new MutationObserver( changes=> changes.map( ch=> {
					console.log(ch)
					switch( ch.type )
					{
						case 'characterData':
							ch.target[XMLTree.Symbol].innerHTML = ch.target.textContent
						break;
						case 'attributes':
							ch.attributeName
						break;
						case 'childList':
							let children = ch.target[XMLTree.Symbol].querySelector('children')
							Array.from( ch.addedNodes )
								// .filter( node=> node.tagName == tag )
								.map( node=> children.append() )
							
						break;
					}
				}))
		// let m = new MutationObserver( changes=> changes.map( ch=> console.log(ch) ) )
		m.observe( this, { childList: true, attributes: true, subtree: true, characterData: true } )
		
	}
	static get tpl_(){ 
		let _ = document.createElement('_')
		return node => {
			// switch( node.nodeType )
			// {
			// 	case Node.ATTRIBUTE_NODE:
			// 	break;
				
			// 	default:
			// 	break;
			// }
			_.innerHTML = `
			<node class="${node.prefix} ${node.localName}" namespace="${node.namespaceURI}"><tag><s title="${node.namespaceURI}">&lt;</s><prefix title="${node.namespaceURI}" contenteditable="true">${!!node.prefix?node.prefix:''}</prefix><localName title="${node.namespaceURI}" contenteditable="true">${node.localName}</localName>${
					Array.from(node.attributes).map(a=>
						`<attr><prefix title="${a.namespaceURI}" contenteditable="true">${!!a.prefix?a.prefix:''}</prefix><localName title="${a.namespaceURI}" contenteditable="true">${a.localName}</localName>${
							a.textContent != '' ?
								`<s>=</s><text contenteditable="true">${a.textContent}</text>`
							:''
						}</attr>`
					).join('')}<s>&gt;</s></tag><children ${node.children.length ? `class="open"` : ''}></children><tag><s>&lt;/</s><prefix>${!!node.prefix?node.prefix:''}</prefix><localName>${node.localName}</localName><s>&gt;</s></tag></node>`
			let res = _.children[0]
			node[XMLTree.Symbol] = res
			res.target = node
			
			Array.from( node.childNodes )
				.map( n=> {
					if( n.nodeType == 3 )
					{
						_.innerHTML = `<text contenteditable="true">${n.textContent}</text>`
						let text = _.children[0]
						n[XMLTree.Symbol] = text
						text.target = n
						res.querySelector('children').append( text )
					}
					else
					{
						res.querySelector('children').append( XMLTree.tpl_(n) )
					}
				})
					
			
			return res
		}
	}
	appendChild( node )
	{
		super.appendChild( node )
		this[XMLTree.Symbol].appendChild( node_(n) )
	}
}
XMLTree.Symbol = Symbol`XMLTree`

document.addEventListener('DOMContentLoaded', e => 
	Array.from( document.querySelectorAll( 'xml-tree' ) )
		.map( n => Object.setPrototypeOf( n, XMLTree.prototype ).XMLTree() )
)

// function mutant( tag, Class )
// {
// 	let m = new MutationObserver( changes=> 
// 				changes.map( ch=> 
// 					ch.addedNodes
// 						.filter( node=> node.tagName == tag )
// 						.map( tree=> Object.setPrototypeOf( n, Class.prototype )[Class.name]() )
// 				)
// 			)
// 	// let m = new MutationObserver( changes=> changes.map( ch=> console.log(ch) ) )
// 	m.observe( document.documentElement, { childList: true } )
// }

// mutant( 'xml-tree', XMLTree )


var toto = {
  name: "Thomas"
}

css`
line42 {display:none}


node.toto s,
node.toto localName,
node.toto attr name
{ display: none }
node.toto attr value
`// Thomas


function css(){}
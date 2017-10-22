class XMLTree extends HTMLElement {
    XMLTree()
    {
        this[XMLTree.Symbol] = this.createShadowRoot()
        this[XMLTree.Symbol].appendChild(`<style>@import 'js/xml-tree.css';</style>`._);
        
        var childs = Array.from( this.children );
        childs.filter( n => n.localName == 'style' )
            .map( n=> this[XMLTree.Symbol].appendChild(n) );
        childs.filter( n => n.localName != 'style' )
            .map( n=> this[XMLTree.Symbol].appendChild( XMLTree.tpl_(n) ) );

    }
    static get tpl_(){ 
        return node => `
            <node class="${node.prefix} ${node.localName}" namespace="${node.namespaceURI}">
                <tag>
                    <s title="${node.namespaceURI}">&lt;</s>
                    <prefix title="${node.namespaceURI}" contenteditable="true">${!!node.prefix?node.prefix:''}</prefix>
                    <localName title="${node.namespaceURI}" contenteditable="true">${node.localName}</localName>

                    ${Array.from(node.attributes).map(a=>`
                        <attr>
                            <prefix title="${a.namespaceURI}" contenteditable="true">${!!a.prefix?a.prefix:''}</prefix>
                            <localName title="${a.namespaceURI}" contenteditable="true">${a.localName}</localName>
                            <s>=</s>
                            <text contenteditable="true">${a.textContent}</text>
                        </attr>
                    `).join('')}
                    <s>&gt;</s>
                </tag>

                    <children ${node.children.length ? `class="open"` : ''}>
                        ${Array.from(node.childNodes).map( n=> n.nodeType == 3 ? `<text contenteditable="true">${n.textContent}</text>` : XMLTree.tpl_(n).outerHTML ).join('')}
                    </children>

                <tag>
                    <s>&lt;/</s>
                    <prefix>${!!node.prefix?node.prefix:''}</prefix>
                    <localName>${node.localName}</localName>
                    <s>&gt;</s>
                </tag>
            </node>`._
    }
    appendChild( node )
    {
        super.appendChild( node );
        this[XMLTree.Symbol].appendChild( node_(n) )
    }
}
XMLTree.Symbol = Symbol`XMLTree`;

document.addEventListener('DOMContentLoaded', e => 
    Array.from( document.querySelectorAll( 'xml-tree' ) )
        .map( n => Object.setPrototypeOf( n, XMLTree.prototype ).XMLTree() )
)



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
# Quick start
With live template strings you can make you UI updates when the data changes.
To acheive this, you need use the `live` function as a template string tag,
with the new es6 backtick strings `\``, this will transform the markup string provided into real DOM objects:
```javascript
var myDiv = live`<div>Hello</div>`
console.log( myDiv.tagName ) // "div"
```

OK, this is boring!! But what are the advantages?
First, you gain advantages from new es6 template string like the
ability to have multiline, to avoid the quote escaping nightmare,
and then, the most exciting feature is the placeholders with `${var}`:

```javascript
var who = "Doctor"
var myDiv = live`<div>
	<span class="greetings">Hello</span>
	${who} !
</div>`
```

Outputs :

```xml
<div>
	<span class="greetings">Hello</span>
	<v-node>Doctor</v-node> !
</div>
```

What's interesting is that live takes care of updating the portion of dom relative to each placeholders
when the data changes.

First you have to make your data bindable:

```javascript
var myData = BindableProxy({
	your: "plain",
	data: "object"
})

// or 
fetch( 'http://some.domain/some/data.json' )
	.then( res=> res.json() )
	.then( json=> BindableProxy(json) )

```

This makes the properties of your object emitting changes event:

```javascript
myData.your.on( e=> console.info('myData.your changed from %s to %s', e.old, e.new ) )
// then
myData.your = 'world' // {type: "propertyChange", old: "plain", new: "world"}
```

You can create a standalone bindable property with <b>Property</b>:

```javascript
var title = Property({ value: "Hello world" })
```

Once used in string templates `live` destects the property can emit changeEvent so it can change the portion of text in the DOM directly (no virtual DOM bull****).


## With a person
```
var personData = BindableProxy({
	"@context": "http://schema.org/",
	"@type": "Person",
	profile: "https://placekitten.com/g/128/170",
	firstName: "Jeanne",
	lastName: "Dupond",
	username: "Jeannette",
	email: "42@Utopia.coop",
	address: "42 av. Utopia",
	country: "France",
	telephone: "06 69 69 69 69"
})
```

Create a simple template function
```
var Person = data => live`
	<div class="Person container">
		<img class="profile" src="${data.profile}">
		<h1>${data.firstName} ${data.lastName} (${data.username})</h1>
		<div class="info telephone">${data.telephone}</div>
		<div class="info address">${data.address}</div>
		<div class="info country">${data.country}</div>
		<div class="info country">${data.email}</div>
	</div>`
document.body.appendChild( Person(personData) )
```

```
<div class="Person container">
	<img class="profile" src="https://placekitten.com/g/128/170">
	<h1><v-node>Jeanne</v-node> <v-node>Dupond</v-node> (<v-node>Jeanette</v-node>)</h1>
	<div class="info telephone"><v-node>06 69 69 69 69</v-node></div>
	<div class="info address"><v-node>42 av. Utopia</v-node></div>
	<div class="info country"><v-node>France</v-node></div>
	<div class="info email"><v-node>42@Utopia.coop</v-node></div>
</div>
```

Template in template:
```
<section id="main">
	${person = Person( personData )}
	${editor1 = new Editor(personData),editor1.pre}
</section>
```


## With a place

${place = Place(placeData)}

${editor2 = new Editor(placeData),editor2.pre}

	
	
	<section title="With theme">
		<demo>
		</demo>
		${editor4 = new Editor(theme),editor4.pre}
	</section>
	
	
	<section title="With dumb">
		<demo>
			<code>var data = Bindable({
		state: "urgent",
		foo: "bar",
		tag: "div",
		name: "Jean",
		rest: "içi"
	})</code>
			<section title="Attribute text binding">
				
				<code>document.body.appendChild( live\`<span class="\${data.state}">\${data.foo}</span>\` )</code>
				<br/>
				<code><span class="${data.state}">${data.foo}</span></code>
				<br/>
				${n6 = live`<span id="n6" class="${data.state}">${data.foo}</span>`}
				<br/>
				
				<code>document.body.appendChild( live\`<span id="n7" class="\${data.state} \${data.name}">\${data.foo}</span>\` )</code>
				<br/>
				<code><span class="${data.state} ${data.name}">${data.foo}</span></code>
				<br/>
				${n7 = live`<span id="n7" class="${data.state} ${data.name}">${data.foo}</span>`}
				<br/>
				
				<code>document.body.appendChild( live\`<span id="n8" class="before \${data.state} \${data.name} after">\${data.foo}</span>\` )</code>
				<br/>
				<code><span class="before ${data.state} ${data.name} after">${data.foo}</span></code>
				<br/>
				${n8 = live`<span id="n8" class="before ${data.state} ${data.name} after">${data.foo}</span>`}
				<br/>
				
				<code>document.body.appendChild( live\`<span id="n9" class="before \${data.state} \${data.name} after" title="\${data.name}">\${data.foo}</span>\` )</code>
				<br/>
				<code><span class="before ${data.state} ${data.name} after" title="${data.name}">${data.foo}</span></code>
				<br/>
				${n9 = live`<span id="n9" class="before ${data.state} ${data.name} after" title="${data.name}">${data.foo}</span>`}
				<br/>
				
			</section>


		</demo>
		${editor3 = new Editor(data),editor3.pre}
	</section>
	
</my-app>


```

// Template functions
var Person = data => live`
		<div class="Person container">
			<img class="profile" src="${data.profile}">
			<h1>${data.firstName} ${data.lastName} (${data.username})</h1>
			<div class="info telephone">${data.telephone}</div>
			<div class="info address">${data.address}</div>
			<div class="info country">${data.country}</div>
			<div class="info country">${data.email}</div>
		</div>
		`


// var editor1
//   , editor2
//   , editor3
//   , editor4
//   , editor5
//   , person
//   ;
// var editor1 = new Editor(personData);
// document.body.appendChild( editor1.pre );


// var person = Person( personData )
// document.body.appendChild( person );



var Col3 = ($1,$2,$3)=>live`
<div id="Clol3" class="row">
	<div class="col-sm-4">${$1}</div>
	<div class="col-sm-4">${$2}</div>
	<div class="col-sm-4">${$3}</div>
</div>
`


// var editor2 = new Editor(data);
// document.body.appendChild( editor2.pre );


// Attribute text binding
var n6 = live`<span id="n6" class="${data.foo}"></span>`
document.body.appendChild( n6 );

var n7 = live`<span id="n7" class="${data.foo} ${data.name}"></span>`
document.body.appendChild( n7 );

var n8 = live`<span id="n8" class="before ${data.foo} ${data.name} after"></span>`
document.body.appendChild( n8 );

var n9 = live`<span id="n9" class="before ${data.foo} ${data.name} after" title="${data.name}"></span>`
document.body.appendChild( n9 );


// Text node text binding
var n1 = live`
<div id="n1" class="aze">coucou ${data.name} !!</div>`;
document.body.appendChild( n1 );


// Attribute text uinding + Text node text binding
var n2 = live`
<div id="n2" class="${data.tag}">coucou ${data.name} !!</div>`;
document.body.appendChild( n2 );

// Tag name binding
var n3 = live`
<div id="n3" class="${data.foo}">
	<${data.tag} class="toto" prop="${data.foo}">
		coucou ${data.name} !!<br>
		<span>le reste ${data.rest}</span>
	</${data.tag}>
</div>`;
document.body.appendChild( n3 );

var n4 = live`
<div id="n4" class="${data.foo}" foo="this is not a tag <- ${data.name} !!! > ">
	<span>${data.name}</span>
</div>
<${data.tag} attr="coucou">content</${data.tag}>

<complex id="n4" attr="42" ${data.isCase?'prop="aze"':''}>
</complex>
`
document.body.appendChild( n4 );

var n5 = live`
<button id="n5" onclick="${e=>console.info('button clicked: %o\ndata: %o',e.target, data)}">
	 <span>${data.tag}</span>
</button>
`
document.body.appendChild( n5 );


var editor3 = new Editor(placeData);
document.body.appendChild( editor3.pre );

// Template call + element replacement
var n0 = live`
<div id="n0" class="main">
	${Col3( placeData.name, placeData.address, placeData.telephone )}
</div>`;
document.body.appendChild( n0 );



var editor4 = new Editor(theme);
document.body.appendChild( editor4.pre );

console.log('aze');

with(theme)
{
	document.head.appendChild(live`
		<style>
			body{
				background-color: #${color1};
				color: #${color2};
			}
			h1 {
				background-color: #${color3};
				color: white;
			}
		</style>
	`)
}

// theme.color1('FFFFFF');
theme.color1 = '607D8B';



var mouse = {
	x: Bindable({value:0}),
	y: Bindable({value:0})
};
window.addEventListener('mousemove', e=> (mouse.x(e.clientX+window.scrollX),mouse.y(e.clientY+window.scrollY)) )

document.body.appendChild( live`
    <img src="http://icons.iconarchive.com/icons/umut-pulat/tulliana-2/128/mouse-icon.png" 
         style="position:absolute;margin: 10px -118px;top:${mouse.y}px;left:${mouse.x}px;"/>` 
 )
```

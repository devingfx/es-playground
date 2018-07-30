/* draft */

const API = (ss,...pp)=> new Proxy(
	Object.assign( ()=>0, {
		url: stick(ss,...pp)
	,	get GET(){ console.log('GET::'+this.url) }
	}), {
		get:(o,p)=> typeof p == 'symbol' || Reflect.has(o,p) ? Reflect.get(o,p) : API`${o.url}/${p}`
	,	apply:(o,t,a)=> console.log('CALL::',o,t,a)
	})


// exemples

let randomuser = API`https://randomuser.me`
randomuser.api['?results=5&nat=FR'].GET

let g1 = API`https://g1.duniter.org`
( await g1.wot.members ).results.map( ({pubkey})=> g1.wot.lookup[pubkey] )

let kumuniter = API`https://kumuniter.devingfx.com`
kumuniter.assets.data`wot.kumu.json`

// other exemples

api.wot.members.then( o=> o.map( m=> scene.add(new THREEx.Planet(m)) ) )
api.wot.members`o=> o.map( m=> scene.add(new THREEx.Planet(m)) )`

var peering;
api.network.peers.then( peers=> peering = peers.map( PeerTpl ) )
var peers = api.network.peers.then( peers=> peering = peers.map( PeerTpl ) )

function aze()
{
    this.api = new MutantAPI('url',this);
    this.api.wot.members`o=> this.members = o`
    this.api.wot.members = this.onMembers
}

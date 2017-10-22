/* draft */

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
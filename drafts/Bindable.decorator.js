export default function Bindable( target, prop, desc )// TODO: ( name, ...types )
{
    
    
    // console.log(desc);
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
    F.value = desc && typeof desc.value != 'undefined' ? desc.value : 0[0];
    F[Bindable.symbol] = [];
    if( desc )
    {
    	if( desc.set )
    		desc.set = desc.set.bind( F.value );
		if( desc.get )
    		desc.get = desc.get.bind( F.value );
    }
    F.on = f => F[Bindable.symbol].push( f )
    F.off = f => !f ? F[Bindable.symbol]=[] : F[Bindable.symbol].splice( F[Bindable.symbol].indexOf(f), 1 )
    F.fire = e => F[Bindable.symbol].map( lstn=> lstn(e) )
    // F[org.schema.description] = desc.description;
    F.toString = function(){ return F.value.toString.apply(F.value, arguments) }
    F.valueOf = ()=> F.value;
    return F;
}
Bindable.symbol = Symbol`[[Bindable]]`

/*
var o = {
	@Bindable
	name: "Foo";
	
	@Bindable
	get state(){}
	set state(v){}
	
	@Bindable({event:'methodMakeChange'})
	method(){}
}

@Bindable
class Foo {}


*/
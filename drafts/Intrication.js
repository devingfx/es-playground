Symbol.proxified = Symbol`[[proxified]]`;
Intrication = class Intrication {
	constructor()
	{
		this[Symbol.proxified] = Array.from( arguments );
		let proxy = new Proxy( this, {
			get: function( o, k )
			{
				if( Reflect.has(o, k) )
					return Reflect.get( o, k );
				debugger;
				for( var obj of o[Symbol.proxified] )
				{
					if( Reflect.has(obj, k) )
					{
						let desc = (cur => {
										var desc;
										while( cur.__proto__ != Object )
										{
											if( desc = Object.getOwnPropertyDescriptor( cur, k ) ) break;
											cur = cur.__proto__;
										}
										return desc;
									})( obj );
						return desc
								? desc.get && desc.get.bind( /native code/.test(desc.get.toString()) ? obj : proxy )()
						 	 		|| desc.value
								: typeof Reflect.get(obj, k) == 'function'
									? Reflect.get(obj, k).bind(obj)
									: Reflect.get(obj, k)
					}
				}
			}
		});
		return proxy;
	}
}
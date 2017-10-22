'use strict';

Object.defineProperties( String.prototype, {
    /*
    `body`.$.appendChild(
        `<div class="">
                Coucou <span>${user.name}</span>!
           </div>`
           ._
    )
    `a[href]`.$
    ._.forEach( `document.body.appendChild`.o )
    */
    '$': {
        get: function()
        {
            return document.querySelector( ''+this )
            
        }
    },
    '$$': {
        get: function()
        {
            return Array.from( document.querySelectorAll( ''+this ) )
            
        }
    },
    /*
    arr = `<div class="">
                Coucou <span>${user.name}</span>!
           </div>`
           ._
    myNode.appendChild( arr[0] )
    */
    '__': {
        get: function()
        {
            var n = document.createElement( 'n' );
            n.innerHTML = ''+this;
            return Array.from( n.childNodes );
        }
    },
    '_': {
        get: function()
        {
            var n = document.createElement( 'n' );
            n.innerHTML = ''+this;
            return n.children[0];
        }
    },
    'js': {
        get: function()
        {
            return eval( '('+this+')' )
        }
    }
    ,
    'json': {
        get: function()
        {
            return JSON.parse( ''+this )
        }
    },
    /*
    `<div class="">
        Coucou <span>monde</span>!
    </div>`
    ._.forEach( `document.body.appendChild`.o )
    'button'.$$.filter( `status == "active"`.f )
    'div'.$$.filter( (o => attributes.enabled(o)) )
    */
    'o': {
        get: function()
        {
            return eval( `o => ${''+this}(o)` )
        }
    },
    'f': {
        get: function()
        {
            return eval( `o => o.${''+this}` )
        }
    }
});



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
})

function Bindable( init )
{
    var prop = function( v )
    {
        if( arguments.length == 1 && v !== prop._value ) // Setter
        {
            prop._value = v;
            prop.fire();
        }
        return prop._value;
    }
    prop._value = init;
    prop._ev = [];
    prop.fire = () => prop._ev.map( f => f(prop._value) )
    prop.onChange = f => prop._ev.push(f)
    return prop;
}

function live(ss)
{
    console.log(arguments);
    
    var l = arguments.length
      , n = document.createElement('n')
      , node
      ;
    
    n.innerHTML = ss.map( (s,i) => 
                        i < (l-1)
                         ? s + '<n i="' + (i+1) + '">' + arguments[i+1]() + '</n>'
                         : s 
                     ).join('');
    node = n.children[0];
    
    Array.from( node.querySelectorAll('n') )
        .map( (nn,i) => arguments[nn.attributes.i.value].onChange( v => nn.innerText = v ) )
    
    return node;
    
    
}






var d;
d = document.createElement(  'html' );
d.innerHTML = 
`<body class="grey-text text-darken-4">
  <div id="fb-root"></div>

        <div class="navbar-fixed">
          <nav role="navigation">
            <div class="nav-wrapper">
              <a id="logo-container" href="/#top" class="brand-logo">
				<div class="navbar__logo">
					LISTES
					<span class="nd_block__logo">NUIT<br/>DEBOUT</span>
					NICE
				</div>
              </a>
              <div class="container">

                <ul class="hide-on-med-and-down">
                  <li><a href="/#header">Le mouvement</a></li>
                  <li><a href="/#calendar">Programme</a></li>
                  <li><a href="/#participate">Participer</a></li>
                  <li><a href="/#assembly">Rassemblements</a></li>
                  <li><a href="https://wiki.nuitdebout.fr/Villes/Nice" target="_blank" >WIKI</a></li>


                </ul>

                <ul id="nav-mobile" class="side-nav">
                  <li><a href="/#header">Le mouvement</a></li>
                  <li><a href="/#calendar">Programme</a></li>
                  <li><a href="/#participate">Participer</a></li>
                  <li><a href="/#assembly">Rassemblements</a></li>
                  <li><a href="https://wiki.nuitdebout.fr/Villes/Nice" target="_blank" >WIKI</a></li>

                </ul>
                <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons grey-text">menu</i></a>

              </div>

              <div class="social-networks">
                <a href="https://www.facebook.com/nicedebout/" target="_blank" class="social-icons facebook">
                  <img src="http://nuitdeboutnice.fr/icons/ic_fb.svg" />
                </a>
                <a href="https://twitter.com/NuitDeboutNice" target="_blank" class="social-icons twitter  hide-on-small-only">
                  <img src="http://nuitdeboutnice.fr/icons/ic_twitter.svg" />
                </a>

                 <a href="https://github.com/nuitdebout/nuitdebout.github.io" target="_blank" class="social-icons github  hide-on-small-only">
                  <img src="http://nuitdeboutnice.fr/icons/ic_github_dark.svg" />
                </a>

              </div>
            </div>
          </nav>
        </div>

        <div class="toolbar">

          <ul>
            <li>
              <a href=""></a>
            </li>

            <li>
              <a href=""></a>
            </li>
          </ul>

        </div>
        <div id="top"></div>




        <div class="section no-pad-bot valign-wrapper nd_header">
          <div class="nd_header__img"> </div>
          <div class="container white-text valign" style="z-index: 2">

            <h1 class="header center nd_brand white-text nd_header__cta">
            	<div class="nd_header__brand">
	            	NUIT<br/>
	            	DEBOUT<br/>
					NICE
            	</div>
        	</h1>
            <h4 class="nd_header__quote header white-text">
              <small></small>
            </h4>
            <div class="row center">
              <a href="http://petition.nuitdebout.fr" class="btn-large waves-effect waves-light indigo">Signer la pétition</a>
            </div>
          </div>

          <a class="nd_header__radio_link  hide-on-small-only" alt="radio debout" href="#radio"><img src="http://nuitdeboutnice.fr/img/svg/radio.svg" style="width:100%;height:100%;"/></a>
        </div>



        <div id="header" class="section">
          <div class="container center">

            <img src="http://nuitdeboutnice.fr/img/svg/manifesto.svg" class="hide-on-med-and-up" style="height: 50px;"/>

            <h2 class="center nd_brand">
              <img src="http://nuitdeboutnice.fr/img/svg/manifesto.svg" class="hide-on-small-only" style="height: 50px;"/>
              Manifeste
              <img src="http://nuitdeboutnice.fr/img/svg/manifesto.svg" class="hide-on-small-only" style="height: 50px; transform: rotateY(180deg);"/>
            </h2>

            <div class="border-text">
              <p> <strong>Sais-tu ce qui se passe là ? </strong> Des milliers de personnes se réunissent<strong> Place Garibaldi à Nice</strong>, et dans toute la France, depuis le 31 mars. Des assemblées se forment où les gens discutent et échangent. Chacun se réapproprie la parole et l’espace public.</p>

              <p>Ni entendues ni représentées, des personnes de tous horizons reprennent possession de la réflexion sur l’avenir de notre monde. La politique n’est pas une affaire de professionnels, <strong>c’est l’affaire de tous</strong>. L’humain devrait être au cœur des préoccupations de nos dirigeants. Les intérêts particuliers ont pris le pas sur l’intérêt général.</p>

              <p><strong>Chaque jour, nous sommes des milliers à occuper l’espace public pour reprendre notre place dans la République.</strong> Venez nous rejoindre, et décidons ensemble de notre devenir commun.</p>
            </div>

          </div>
        </div>
		
		<div id="wiki" class="section">
			<h2 class="center nd_brand">WIKI PAGE</h2>
            <div class="container nd_wiki">
          	</div>
		</div>
        
        <div id="calendar" class="section">
          <h2 class="center nd_brand">Programme</h2>
          <div class="container nd_calendar">

            <div class="row masonry-container">

              <div class="col s12 m6">
                <div class="card">
                  <div class="card-content">
                    <h4 class="card-title"><span class="chip blue darken-4 white-text">lundis aux jeudis</span> NuitDebout Nice</h4>
                    <dl>
                      <dt>19h00</dt><dd>Agora, ateliers des commissions, ateliers thèmatiques, discussion libre</dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div class="col s12 m6">
                <div class="card">
                  <div class="card-content">
                    <h4 class="card-title"><span class="chip blue darken-4 white-text">les weekends</span> Grandes NuitDenout Nice</h4>
                    <dl>
                      <dt>19h00</dt><dd>Agora, ateliers des commissions, ateliers thèmatiques, artistes musicaux, artistes de rues, graphs, ce vous y amènerez ... </dd>
                    </dl>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>








        <div id="participate" class="section">
          <div class="container">
            <h2 class="center nd_brand">
              Comment participer ?
            </h2>


      
</div></div>
</body>`;
document.documentElement.appendChild( d );
document.documentElement.style.display = 'block';
/*
      </div>
      
      
      
            <p> Chaque jour, nous nous retrouvons place de la République à Paris, et partout en France. De là, plein de choses sont possibles.</p>
            <div class="row">
              <div class="col s12 m6 l4">
                <div class="card small">
                  <div class="card-image blue lighten-3 waves-effect waves-block waves-light">
                    <div class="activator center"><img src="/img/svg/ag.svg" class="activator"style="height: 200px; width:200px; margin: 10px; display: inline-block;"/>
                    </div>
                  </div>
                  <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">L'Assemblée Populaire</span>
                  </div>
                  <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">L'Assemblée Populaire<i class="material-icons right">close</i></span>
                    <p>Chaque jour, à <strong> 19h </strong>, l'assemblée générale se rassemble. C'est le moment fort de la journée, ou notre rassemblement prends son sens. On vote les décisions importantes du mouvement, on débat, on échange les points de vue. Chacun peut venir s'exprimer, dans l'écoute de tous.</p>
                  </div>
                </div>
              </div>
              <div class="col s12 m6 l4">
                <div class="card small">
                  <div class="card-image blue lighten-3  waves-effect waves-block waves-light">
                    <div class="activator center">
                      <img src="/img/svg/orga.svg" class="activator" style="height: 200px; width:150px; margin: 10px; display: inline-block;"/>
                    </div>
                  </div>
                  <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">Aider sur l'operationnel</span>
                  </div>
                  <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">Operationnel<i class="material-icons right">close</i></span>
                    Vous pouvez venir chaque jour proposer votre aide au <strong>stand inscriptions</strong>. Il y a toujours des choses à faire, surtout si vous venez tôt. Vous pouvez aussi laisser votre contact avec vos disponibilité et vos compétences.
                    Enfin, nous avons toujours besoin de ressources pour le campement. N'hésitez pas à passer au <strong>stand logistique</strong> pour avoir plus d'infos.
                  </div>
                </div>
              </div>
              <div class="col s12 m6 l4">
                <div class="card small">
                  <div class="card-image blue lighten-3  waves-effect waves-block waves-light">
                    <div class="activator center">
                      <img src="/img/svg/commission.svg"  class="activator" style="height: 200px; width:250px; margin: 10px; display: inline-block;"/>
                    </div>
                  </div>
                  <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">Participer aux commissions</span>
                  </div>
                  <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">Commissions<i class="material-icons right">close</i></span>
                    Chaque jour, des atelier, commissions, espaces de discussions se créent autour de thème. N'hésitez pas à venir participer à l'invention du futur avec nous !
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

      </div>


  <footer class="page-footer">
      <div class="container">
        <div class="row" >



          <div class="col s6">
            <h5>#NuitDeboutNice</h5>
                <div class="social-networks social-networks--footer">

                  <a href="https://www.facebook.com/nicedebout/" target="_blank" class="social-icons facebook">
                    <img src="http://nuitdeboutnice.fr/icons/ic_fb_light.svg" />
                  </a>
                  <a href="https://twitter.com/NuitDeboutNice" target="_blank" class="social-icons twitter ">
                    <img src="http://nuitdeboutnice.fr/icons/ic_twitter_light.svg" />
                  </a>

                   <a href="https://github.com/nuitdebout/nuitdebout.github.io" target="_blank" class="social-icons github  ">
                    <img src="http://nuitdeboutnice.fr/icons/ic_github_light.svg" />
                  </a>
              </div>

          </div>

          <div class="col s6">
            <h5>Voir aussi</h5>
            <a target="_blank" href="https://www.convergence-des-luttes.org/">
              <img src="http://nuitdeboutnice.fr/img/CONVERGENCE-DES-LUTTES.png"/>
            </a>
          </div>

        </div>
      </div>
    </footer>

  <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.0.0/masonry.pkgd.min.js"></script>
  <script type="text/javascript" src="http://nuitdeboutnice.fr/js/materialize.min.js"></script>
  <script type="text/javascript" src="http://nuitdeboutnice.fr/js/underscore-min.js"></script>
  <script type="text/javascript" src="http://nuitdeboutnice.fr/js/jQuery.succinct.min.js"></script>
  <script src="http://nuitdeboutnice.fr/js/main.js"></script>
  <script src="mediawiki-js/MediawikiJS.js"></script>
  <script src="instaview.js"></script>
  <script>
  	$ = s => document.querySelectorAll(s);
  	InstaView.conf.paths.articles = '';
  	MediaWikiJS.prototype.getArticle = function( path, cb )
  	{
  		this.send({
	  			action: 'query',
	  			prop: 'revisions',
	  			rvprop: 'content',
	  			titles: rootArticle + (path != '' ? '/'+path : '')
	  		}, 
	  		function (data)
	  		{
			    var pages = data.query.pages;
			    for(var n in pages);
			    console.log(pages);
			    cb( InstaView.convert( pages[n].revisions[0]['*'] ) );
			    // console.log('Last edited by: ' + pages[Object.keys(pages)[0]].revisions[0].user);
		});
  	};
  	MediaWikiJS.prototype.getArticle = function( path, cb )
  	{
	    cb( InstaView.convert( wikiPage ) );
  	};
  	
  	var wiki = MediaWikiJS({baseURL: 'https://wiki.nuitdebout.fr', apiPath: '/api.php'}),
  		rootArticle = 'Villes/Nice';
  	
  	wiki.getArticle( 'Numérique', html => 
	    // $('#wiki .nd_wiki').append( html )
	    $('#wiki .nd_wiki')[0].innerHTML = html
  	)
  	
  	
	// history.pushState({page: '/Villes/Nice'}, 'Nice', '/');
  </script>
*/
var sh = require('../src/sh.node.js');
// var ssh = require('../src/ssh.node.js');

var name = sh`whoami`

var files = sh`ls`.split('\n')

console.log(
    sh`ls -al`.trim().split('\n').map( s=> {
        var R = s.split(' ')
          , yuno = l=>l=='-'?"'t":""
          , name = R[3]
          , rights = R[0]
          , file = R[8]
          ;
        return `Mr ${name} can${yuno(rights[1])} read the file ${file} ...`
    })
);



// ssh`127.0.0.1:8762`

// ssh`hostname`


// aze= sed`<tpl sed>`
// aze( string )
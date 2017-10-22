

// nodejs's process exec with sh``
module.exports = function sh(ss)
{
    var stdout;
    console.log(
        stdout = require('child_process').execSync( 
                    ss.map( 
                        (s,i) => s+(typeof arguments[i+1] != 'undefined' ? arguments[i+1] : '') 
                    ).join('')
                  , {encoding:'utf-8'}
                )
    )
    return stdout;
}

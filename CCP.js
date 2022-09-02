const fs = require('fs')

const ccp_path = './_file.connectionProfile.json'



function loadCCP(){
    const ccp = JSON.parse(
        fs.readFileSync(ccp_path).toString()
    )
    //console.log(ccp)
    return ccp        
}


module.exports = {
    loadCCP
}
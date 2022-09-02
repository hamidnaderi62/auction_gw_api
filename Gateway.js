const {Gateway , Wallets} = require('fabric-network')
const CCP = require('./CCP')

async function createGateway(walletId){
    const gateway = new Gateway()

    //connection profile
    const ccp = CCP.loadCCP()

    //wallet
    const wallet = await Wallets.newFileSystemWallet('./wallet')

    await gateway.connect(ccp, {
        identity: walletId,
        wallet,
        discovery: { enabled: false, asLocalhost: false }
    });


    return gateway
}

module.exports = {
    createGateway
}
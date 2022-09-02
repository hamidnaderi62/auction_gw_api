
const {createGateway} = require('./Gateway')

async function invoke(serverUserId, channelName, chaincodeName, methodName , methodParams){
    const gateway = await createGateway(serverUserId)
    //console.log(gateway)

    //channel
    const channel = await gateway.getNetwork(channelName)
    //console.log(channel)

    //chaincode
    const chaincode = await channel.getContract(chaincodeName)
    //console.log(chaincode)

    //invoke
    const result = await chaincode.submitTransaction(methodName , ...methodParams)
    console.log(result)
    return result
}

async function evaluate(serverUserId, channelName , chaincodeName, methodName , methodParams){
    const gateway = await createGateway(serverUserId)

    //channel
    const channel = await gateway.getNetwork(channelName)

    //chaincode
    const chaincode = await channel.getContract(chaincodeName)

    //evaluate
    const resultBuffer = await chaincode.evaluateTransaction(methodName , ...methodParams)
    const result = JSON.parse(
        resultBuffer.toString()
    )
    console.log(result)
    return result
}


 async function test(){
    //invoke('interairlining','interairlining')

    // let res = await invoke(
    //     'interairlining',
    //     'interairlining',
    //     'createBaggage',
    //     ["bag_005", "user_0001", "36", "136"]
    // )
    // console.log(res)

    // await evaluate(
    //     'interairlining',
    //     'interairlining',
    //     'getBaggage',
    //     ["bag_003"]
    // )
 }  


test()

module.exports = {
    invoke,
    evaluate
}
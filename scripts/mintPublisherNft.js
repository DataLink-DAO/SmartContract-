const { getNamedAccounts, network, ethers } = require("hardhat")
const util = require("util")
const request = util.promisify(require("request"))

async function callRpc(method, params) {
    var options = {
        method: "POST",
        url: "https://api.hyperspace.node.glif.io/rpc/v1",
        // url: "http://localhost:1234/rpc/v0",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: 1,
        }),
    }
    const res = await request(options)
    return JSON.parse(res.body).result
}

async function mint() {
    const { deployer } = await getNamedAccounts()
    const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

    const PublisherNft = await ethers.getContract("PublisherNft", deployer)
    const PublisherNftMintTx = await PublisherNft.mintNft(
        "0xb636C663De47df7cf95F1E87C86745dd7f7E3d67",
        {
            maxPriorityFeePerGas: priorityFee,
        }
    )
    await PublisherNftMintTx.wait(1)
    console.log(`PublisherNft index 0 has tokenURI:${await PublisherNft.tokenURI(0)}`)
    /* const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log(`Token ID: ${tokenId}`)
    console.log(`NFT Address: ${PublisherNft.address}`) */
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

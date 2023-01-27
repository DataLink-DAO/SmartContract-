const { getNamedAccounts, deployments, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
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

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = []
    const priorityFee = await callRpc("eth_maxPriorityFeePerGas")

    const deployLogError = async (title, obj) => {
        let ret
        try {
            ret = await deploy(title, obj)
        } catch (error) {
            console.log(error.toString())
            process.exit(1)
        }
        return ret
    }
    console.log("Wallet Ethereum Address:", deployer)

    const PublisherNft = await deployLogError("PublisherNft", {
        from: deployer,
        args: args,
        maxPriorityFeePerGas: priorityFee,
        log: true,
    })
    log(`PublisherNft deployed at ${PublisherNft.address}`)

    /* if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(PublisherNft.address, args)
    } */
}

module.exports.tags = ["all", "PublisherNft", "main"]

const { getNamedAccounts, deployments, network, ethers } = require("hardhat")
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config")
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

    const args = [MIN_DELAY, [], [], deployer]

    const timeLock = await deployLogError("TimeLock", {
        from: deployer,
        args: args,
        log: true,
        maxPriorityFeePerGas: priorityFee,
    })
    log(`timelock deployed at ${timeLock.address}`)
    const argsToken = ["DaoToken", "Dao", "1000000"]

    const governanceToken = await deployLogError("GovernanceToken", {
        from: deployer,
        args: argsToken,
        log: true,
        maxPriorityFeePerGas: priorityFee,
    })
    log(`governanceToken deployed at ${governanceToken.address}`)
    await delegate(governanceToken.address, deployer)
    console.log(`Delegated!`)
    const timeLockContract = await ethers.getContract("TimeLock")
    const governanceTokenContract = await ethers.getContractAt(
        "GovernanceToken",
        governanceToken.address
    )
    const transferOwnerTx = await governanceTokenContract.transferOwnership(
        timeLockContract.address,
        {
            maxPriorityFeePerGas: priorityFee,
        }
    )
    await transferOwnerTx.wait(1)
    log("governanceTokenContract Ownership transfered!")

    /*  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, args)
    } */

    
}

const delegate = async (governanceTokenAddress, delegatedAccount) => {
    const priorityFee = await callRpc("eth_maxPriorityFeePerGas")
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const tx = await governanceToken.delegate(delegatedAccount, {
        maxPriorityFeePerGas: priorityFee,
    })
    await tx.wait(1)
    console.log(`Checkpoint ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

module.exports.tags = ["all", "timeLock"]

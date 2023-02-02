const { ethers, network } = require("hardhat")
const fs = require("fs")

const frontEndContractsFile = "./datalinkdaofrontend/constants/networkMapping.json"
const fromEndAbiLocation = "./datalinkdaofrontend/constants/"
module.exports = async function () {
    console.log("uptading front end ...")
    await updateContractAddresses()
    await uptadeAbi()
}

async function uptadeAbi() {
    const PublisherNft = await ethers.getContract("PublisherNft")
    fs.writeFileSync(
        `${fromEndAbiLocation}PublisherNft.json`,
        PublisherNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const foodTrusty = await ethers.getContract("PublisherNft")
    const chainId = network.config.chainId.toString()

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))

    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["PublisherNft"].includes(foodTrusty.address)) {
            contractAddresses[chainId]["PublisherNft"].push(foodTrusty.address)
        }
    } else {
        contractAddresses[chainId] = { PublisherNft: [foodTrusty.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]

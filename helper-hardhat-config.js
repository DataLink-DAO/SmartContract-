const { ethers } = require("hardhat")

const networkConfig = {
    3141: {
        name: "hyperspace",
        tokenToBeMinted: 12000,
    },
    5: {
        name: "goerli",
        enteranceFee: ethers.utils.parseEther("0.01"),
        daoPercentage: "10",
    },
    80001: {
        name: "mumbai",
        enteranceFee: ethers.utils.parseEther("0.01"),
        daoPercentage: "10",
    },
    31337: {
        name: "hardhat",
        enteranceFee: ethers.utils.parseEther("0.01"),
        daoPercentage: "10",
    },
}

const developmentChains = ["hardhat", "localhost"]
const MIN_DELAY = 0

module.exports = {
    networkConfig,
    developmentChains,
    MIN_DELAY,
}

require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("./tasks")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")

const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const ETHERSCAN_API_KEY_MUMBAI = process.env.ETHERSCAN_API_KEY_MUMBAI
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    defaultNetwork: "hyperspace",
    networks: {
        hyperspace: {
            chainId: 3141,
            url: "https://api.hyperspace.node.glif.io/rpc/v1",
            accounts: [PRIVATE_KEY],
        },
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
            allowUnlimitedContractSize: true,
        },
        localhost: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY,
            polygonMumbai: ETHERSCAN_API_KEY_MUMBAI,
        },
        customChains: [],
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
        //token: "MATIC",
    },

    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}

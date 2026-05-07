// function deployFunction(){
//     console.log("This is a deploy function");
// }

// module.exports.default = deployFunction;
// module.exports = async function (hre) {
//     console.log("this is a deploy script");
// }
const {network} = require("hardhat");
const {devlopmentChains, networkConfig, LOCK_TIME,CONFIRMATIONS} = require("../helper-hardhat-config");

module.exports = async function ({getNamedAccounts, deployments}) {
    const {firstAccount} = await getNamedAccounts();
    const {deploy} = deployments;
    let dataFeedAddr;
    let confirmations;
    if (devlopmentChains.includes(network.name)) {
        const mockDataFeed = await deployments.get("MockV3Aggregator"); // this ensures that the MockV3Aggregator is deployed before deploying the fundme contract
        dataFeedAddr = mockDataFeed.address;
        confirmations = 0;
    }else{
        dataFeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed; // address of sepolia eth/usd price feed
        confirmations = CONFIRMATIONS;
    }
    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, dataFeedAddr],
        log: true,
        waitConfirmations: confirmations,
    });
    // remove deployments directory or add --reset flag if you want to redeploy the contract with the same name
    if(hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments:  [LOCK_TIME, dataFeedAddr],
        });
    }else{
        console.log("Skipping verification. Not on Sepolia or missing Etherscan API key.");
    }
}

module.exports.tags = ["all", "fundme"];
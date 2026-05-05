const {DECIMAL, INITIAL_ANSWER,devlopmentChains} = require("../helper-hardhat-config");
module.exports = async function ({getNamedAccounts, deployments, network}) {
    if (devlopmentChains.includes(network.name)) {
        const {firstAccount} = await getNamedAccounts();
        const {deploy} = deployments;
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true,
        });
    }else{
        console.log("You are on a live network, no need to deploy mocks!"); 
    }
}

module.exports.tags = ["all", "mock"];
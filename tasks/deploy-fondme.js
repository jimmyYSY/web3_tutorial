const {task} = require("hardhat/config");

task("deploy-fundme", "Deploy and verify fundme contract").setAction(async (taskArgs, hre) => {
    //create factory 
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying contract...");
    //deploy contract
    const fundMe = await fundMeFactory.deploy(300);
    await fundMe.waitForDeployment();
    console.log("contract has been deployed to:", fundMe.target);

    if(hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
        // Wait for 5 confirmations and 1 minute for Etherscan to index the contract
        console.log("Waiting for 5 confirmations and Etherscan indexing...");
        await fundMe.deploymentTransaction().wait(5);
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60 seconds
        //verify contract
        console.log("Verifying contract on Etherscan...");
        await veriifyFundMe(fundMe.target, [300]);
    } else {
        console.log("Skipping verification. Not on Sepolia or missing Etherscan API key.");
    }

})

async function veriifyFundMe(fundMeAddr, args){
    // await hre.run("verify:verify", {});
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}

module.exports = {};
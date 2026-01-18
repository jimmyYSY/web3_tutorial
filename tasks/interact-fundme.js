const {task} = require("hardhat/config");

task("interact-fundme", "Interacts with the FundMe contract")
    .addParam("addr","fundme contract address")
    .setAction(async (taskArgs, hre) => {

    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.attach(taskArgs.addr);
    console.log("Interacting with contract at:", fundMe.target);

    // init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners();
    console.log("Account 1 address:", firstAccount.address);
    console.log("Account 2 address:", secondAccount.address);
    
    // fund contract with first account
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.5")});
    await fundTx.wait();
    console.log("Funded contract with 1 ETH from Account 1");
    
    // check balance of contract 
    const contractBalance = await ethers.provider.getBalance(fundMe.target);
    console.log("Contract balance after funding from Account 1:", ethers.formatEther(contractBalance), "ETH");
    
    // fund contract with second account
    const fundTx2 = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.5")});
    await fundTx2.wait();
    console.log("Funded contract with 1 ETH from Account 2");
    
    // check balance of contract
    const contractBalance2 = await ethers.provider.getBalance(fundMe.target);
    console.log("Contract balance after funding from Account 2:", ethers.formatEther(contractBalance2), "ETH");
    
    // check mapping fundersToAmount
    const firstAccountbalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address);
    console.log("Account 1 funded amount:", ethers.formatEther(firstAccountbalanceInFundMe), "ETH");
    console.log("Balance of fist account" + firstAccount.address + " is " + contractBalance);
    const secondAccountbalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address);
    console.log("Account 2 funded amount:", ethers.formatEther(secondAccountbalanceInFundMe), "ETH");
    console.log("Balance of second account" + secondAccount.address + " is " + contractBalance2);
});

module.exports = {};
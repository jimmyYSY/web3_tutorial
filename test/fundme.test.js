const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

describe("test fundme contract", async function () {
    let fundMe;
    let firstAccount;
    this.beforeEach(async function () {
        await deployments.fixture(["all"]) // deploys all the contracts with the tags "all"
        firstAccount = (await getNamedAccounts()).firstAccount;
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
    })

    it("test if the owner is msg.sender", async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()), firstAccount)
    })    
    it("test if the datafeed is assigned correctly", async function () {
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()), "0x694AA1769357215DE4FAC081bf1f309aDC325306") // address of sepolia eth/usd price feed
    })
})
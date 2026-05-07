const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { expect } = require("chai")
const { devlopmentChains } = require("../../helper-hardhat-config");
devlopmentChains.includes(network.name)
 ? describe.skip
 : describe("test fundme contract", async function () {
    let fundMe;
    let firstAccount;
    this.beforeEach(async function () {
        await deployments.fixture(["all"]) // deploys all the contracts with the tags "all"
        firstAccount = (await getNamedAccounts()).firstAccount;
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
    })

    // test fund and getFund successfully
    it("fund an getFund successfully", async function () {
        // make sure target reached
        await fundMe.fund({ value: ethers.parseEther("0.5") });
        // make sure window is closed
        await new Promise(resolve => setTimeout(resolve, 181 * 1000)); // wait for 1 second
        // make sure we can get receipt
        const getFundTx = await fundMe.getFund();
        const getFundReceipt = await getFundTx.wait();
        expect(getFundReceipt).to.be.emit(fundMe, "FundWithdrawByOwner").withArgs(ethers.parseEther("0.5"));
    })

    // test fund and refund successfully
    it("fund and refund successfully", async function () {
        // make sure target reached
        await fundMe.fund({ value: ethers.parseEther("0.1") });
        // make sure window is closed
        await new Promise(resolve => setTimeout(resolve, 181 * 1000)); // wait for 1 second
        // make sure we can get receipt
        const refundTx = await fundMe.refund();
        const refundReceipt = await refundTx.wait();
        expect(refundReceipt).to.be.emit(fundMe, "RefundByFunder").withArgs(firstAccount, ethers.parseEther("0.1"));
    })
})
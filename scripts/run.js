const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);

    let waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let waveTxn = await waveContract.wave("Contract message");
    await waveTxn.wait();

    const [ownder, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await waveContract.connect(ownder).wave("Owner message!");
    await waveTxn.wait(); // Wait for the transaction to be mined
    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait(); // Wait for the transaction to be mined

    contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();

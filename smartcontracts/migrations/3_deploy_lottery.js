const Lottery = artifacts.require('Lottery')
const SirGeoToken = artifacts.require('SirGeoToken')



module.exports = async (deployer, network) => { 
    if (network === 'development' || network === 'rskTestnet') { 
        let instance = await SirGeoToken.deployed()
        console.log("👀token address: ", instance.address)
        await deployer.deploy(Lottery, instance.address)
        console.log('Contract implementation: ' + Lottery.address)
    }
}
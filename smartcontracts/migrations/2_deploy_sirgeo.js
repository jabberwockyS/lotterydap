const SirGeoToken = artifacts.require('SirGeoToken')



module.exports = async (deployer, network, accounts) => { 
    const [contractAdmin, payee] = accounts
    console.log(accounts)
    if (network === 'development' || network === 'rskTestnet' ) { 
        await deployer.deploy(SirGeoToken, web3.utils.toBN(10000000000000000000))
        console.log('Contract implementation: ' + SirGeoToken.address)
    }
}
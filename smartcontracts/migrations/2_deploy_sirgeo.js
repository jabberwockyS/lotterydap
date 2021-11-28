const SirGeoToken = artifacts.require('SirGeoToken')



module.exports = async (deployer, network, accounts) => { 
    const [contractAdmin, payee] = accounts
    console.log(accounts)
    if (network === 'development' || network === 'rskTestnet' ) { 
        await deployer.deploy(SirGeoToken)
        console.log('Contract implementation: ' + SirGeoToken.address)
    }
}
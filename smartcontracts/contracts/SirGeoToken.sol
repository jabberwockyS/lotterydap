pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";



contract SirGeoToken is ERC20 { 

    constructor(uint256 initialSupply) ERC20("SirGeo3", "SGO3") {
        _mint(msg.sender, initialSupply);
    }

}
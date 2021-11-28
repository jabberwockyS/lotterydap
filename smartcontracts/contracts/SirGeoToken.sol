pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";



contract SirGeoToken is Context, ERC20 { 

    constructor() ERC20("SirGeo", "SGO") {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }

}
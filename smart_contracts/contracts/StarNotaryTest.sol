pragma solidity ^0.4.23;

import "./StarNotary.sol";
import './StarLib.sol';

contract StarNotaryTest is StarNotary {
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
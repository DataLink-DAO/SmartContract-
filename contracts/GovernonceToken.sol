// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GovernanceToken is ERC20Votes, Ownable {
    event TokenTransfer(address indexed _from, address indexed _to, uint256 _amount);

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _initialSupply
    ) ERC20(_tokenName, _tokenSymbol) ERC20Permit(_tokenName) {
        _mint(msg.sender, _initialSupply);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
        emit TokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) onlyOwner {
        super._mint(to, amount);
    }

    function mintToken(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burnToken(address account, uint256 amount) external {
        _burn(account, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}

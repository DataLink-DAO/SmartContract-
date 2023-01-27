// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error PublisherNft__NotOwner();

contract PublisherNft is ERC721 {
    uint256 private s_tokenCounter = 0;
    address public /* immutable */ i_owner;

    modifier onlyOwner() {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert PublisherNft__NotOwner();
        _;
    }

   
    string public constant TOKEN_URI =
        "ipfs://QmaH4bR5zzHsnEL7KUEyNXM48q7QHWJoGebirsYaqkf71Z";


    constructor() ERC721("Publisher", "PUB") {
        s_tokenCounter = 0;
        i_owner = msg.sender;
    }

    function mintNft() public onlyOwner returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
        return s_tokenCounter;
    }

    function tokenURI(uint256 /*tokenId*/) public view override returns (string memory) {
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}

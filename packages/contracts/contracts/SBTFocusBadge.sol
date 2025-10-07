// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SBTFocusBadge is ERC721, Ownable {
    mapping(address => bool) public minters;

    error Soulbound();

    constructor() ERC721("FocusFlow Soulbound", "FFSBT") {}

    function setMinter(address minter, bool enabled) external onlyOwner {
        minters[minter] = enabled;
    }

    function mintBadge(address user, uint8 badgeType, bytes32 periodRoot) external {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized");
        uint256 tokenId = uint256(keccak256(abi.encode(user, badgeType, periodRoot)));
        _safeMint(user, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override
    {
        if (from != address(0) && to != address(0)) {
            revert Soulbound();
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}

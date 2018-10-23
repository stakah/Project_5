pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';
import './StarLib.sol';

contract StarNotary is ERC721 { 

    // Star metadata
    struct Star { 
        string name;
        string story;
        string Ra;
        string Dec;
        string Mag;
        string Cent;
        uint256 tokenId;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;

    // Array of stars
    Star[] internal stars;

    function createStar(string _name, string _story,
       string _ra, string _dec, string _mag, string _cent, uint256 _tokenId) public { 
        Star memory newStar = Star(_name, _story, _ra, _dec, _mag, _cent, _tokenId);
        require(!checkIfStarExist(newStar.Ra, newStar.Dec, newStar.Mag, newStar.Cent), "Star already created");

        tokenIdToStarInfo[_tokenId] = newStar;
        stars.push(newStar);

        _mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);
        
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    /// Utilizing star coordinates, this function will check if the coordinates have already been claimed.
    /// The return type is boolean.
    function checkIfStarExist(string _ra, string _dec, string _mag, string _cent) public view returns(bool) {
        for (uint i=0; i<stars.length; i++) {
            Star memory s = stars[i];
            if (StarLib.strCompare(s.Ra, _ra) == 0 &&
                StarLib.strCompare(s.Dec, _dec) == 0 &&
                StarLib.strCompare(s.Mag, _mag) == 0 &&
                StarLib.strCompare(s.Cent, _cent) == 0) {
                    return true;
                }
        }
        return false;
    }

    function StarsForSale() public view returns (uint256[]) {
        uint n = 0;
        for (uint256 i=0; i<stars.length; i++) {
            if (starsForSale[stars[i].tokenId] > 0) {
                n++;
            }
        }

        uint j = 0;
        uint256[] memory forSale = new uint256[](n);
        for (uint256 k=0; k<stars.length; k++) {
            if (starsForSale[stars[k].tokenId] > 0) {
            forSale[j++] = stars[k].tokenId;
            }
        }

        return forSale;
    }

    //function approve(address to, uint256 tokenId) public {
    //    ERC721.approve(to, tokenId);
    //}

    /* Functions implemented by open zeppelin
     *
     * - function _mint(address to, uint256 tokenId) internal;
     *
     * - function approve(address to, uint256 tokenId) public;
     *
     * - function safeTransferFrom(
     *    address from,
     *    address to,
     *    uint256 tokenId
     *  )
     *   public;
     *
     * - function setApprovalForAll(address to, bool approved) public;
     *
     * - function getApproved(uint256 tokenId) public view returns (address);
     *
     * - function isApprovedForAll(
     *    address owner,
     *    address operator
     *  )
     *    public
     *    view
     *    returns (bool);
     *
     * - function ownerOf(uint256 tokenId) public view returns (address);
     */

}
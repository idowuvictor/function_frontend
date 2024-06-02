// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Namekeeper{
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    mapping(address => string) public names;

    function setname(string  memory _name) public {
        names[msg.sender] = _name;
    }

    function getname() public view returns (string memory){
        if(bytes(names[msg.sender]).length == 0){
            revert("Name not set");
        }
        return names[msg.sender];
    }
}
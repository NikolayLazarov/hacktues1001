// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Storage is Ownable{
    event createdMeasurement(bytes id,uint time);
    event addedMedic(address medic);

    constructor() Ownable() {}

    modifier onlyMedic(){
        require(medics[msg.sender],"Not medic");
        _;
    }

    struct Measurement{
        bytes id;
        bytes data;
        uint time;
    }

    mapping(address=>bool) public medics;
    mapping(bytes => Measurement) public measurements;
    mapping(bytes => bool) public measurementExists;

    
    function createMeasurement(bytes calldata _id, bytes calldata _data) public onlyMedic {
        Measurement memory m = Measurement(_id, _data, block.timestamp);
        measurements[_id]=m;
        measurementExists[_id]=true;
        
        emit createdMeasurement(_id,block.timestamp);
    }

    function addMedic(address _medic) public onlyOwner{
        medics[_medic]=true;
        emit addedMedic(_medic);
    }

}

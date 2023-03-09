// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Storage is Ownable{
    event createdMeasurement(uint MId,bytes UId);
    event addedMedic(address medic);

    constructor() Ownable() {}

    modifier onlyMedic(){
        require(medics[msg.sender],"Not medic");
        _;
    }
    struct User{
        address addr;
        uint measurementCount;
    }

    struct Measurement{
        bytes UId;
        bytes data;
        uint MId;
    }
    mapping(address=>bool) medics;
    mapping(address=>User) users;
    Measurement[] measurements;

    function createMeasurement(bytes calldata _data, bytes calldata _UId, uint _MId) public onlyMedic {
        Measurement memory m = Measurement(_UId, _data, _MId);
        measurements.push(m);
        emit createdMeasurement(_MId, _UId);
    }

    function addMedic(address _medic) public onlyOwner{
        medics[_medic]=true;
        emit addedMedic(_medic);
    }


}

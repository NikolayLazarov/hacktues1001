import { useEffect, useState } from 'react'
import './Data.css'
import Graph from '../components/Graph'
import Field from '../components/Field'
import { ethers } from "ethers";

import contractABI from"../../../contractDetails/MedicalStorage.json";
import ContractAddress from "../../../contractDetails/address.json";
// import { provider, signer } from '../App'

function Data(props) {
  const [contract, setContract] = useState(null);
  const [currentContractValue, setCurrentContractValue] = useState(null);
  const contractAddress = ContractAddress.medicalStorage;
  
  const data = [
    {
    "hash": "",
    "temperature": 37,
    "oxygen": 25,
    "pulse": 90,
    "date": "2021-03-01"
    },
    {
    "hash": "",
    "temperature": 38,
    "oxygen": 30,
    "pulse": 95,
    "date": "2021-04-01"
    },
    {
    "hash": "",
    "temperature": 39,
    "oxygen": 35,
    "pulse": 100,
    "date": "2021-05-01"
    }
  ]
  function hexToArray(hexx) {
    var hex = hexx.toString().slice(2);
    var arr = [];
    for (var i = 0; i < hex.length; i += 2){
        //console.log(hex.substr(i, 2))
        arr.push(parseInt(hex.substr(i, 2), 16));
        //console.log(arr);
    }
    return arr;
}
useEffect(()=>{
      console.log(props.provider);
      console.log(props.signer);
      let tempContract = new ethers.Contract(contractAddress,contractABI.abi, props.provider);
      setContract(tempContract);
  },[]);


async  function getHashes(){
  let hash = hexToArray("0x"+props.hash);
  let val = await contract.measurements("0x12345678901234567890");
  console.log(hexToArray(val.data))
  setCurrentContractValue(val);
}

  return (
    <div className="Data">
      <div className="pfp"> </div>
      <div className="name">Josif Bezkosa</div>
      <div className="personal-id">1234567</div>
      
      <Graph className="graph" title="temperature" data={data}/>
      <Graph className="graph" title="oxygen" data={data}/>
      <Graph className="graph" title="pulse" data={data}/>
      <Field />

      <button onClick={getHashes}>Batton</button>
      <div>{props.hash}</div>
      {/*currentContractValue*/}
    </div>
  )
}

export default Data;

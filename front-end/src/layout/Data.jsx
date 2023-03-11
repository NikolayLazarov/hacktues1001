import { useEffect, useState } from 'react'
import './Data.css'
import Graph from '../components/Graph'
import Field from '../components/Field'
import { ethers } from "ethers";

import contractABI from"../../../contractDetails/MedicalStorage.json";
import ContractAddress from "../../../contractDetails/address.json";
// import { provider, signer } from '../App'

function Data(props) {
  //const [contract, setContract] = useState(null);
  const [currentContractValue, setCurrentContractValue] = useState(null);
  const contractAddress = ContractAddress.medicalStorage;

  const contract = new ethers.Contract(contractAddress,contractABI.abi, props.provider);

  function codesToString(arr){
    return String.fromCharCode(...arr);
}
  function stringToHex(str){
    var arr1 = ['0','x'];
    for (var n = 0, l = str.length; n < l; n ++){
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }
    return arr1.join('');
  }

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

      getHashes();
  },[]);



async  function getHashes(){
  const data = [];
  props.hash.map(async (hash)=>{
  let newHash = stringToHex("0x"+hash);
  console.log(newHash);
  console.log(await contract.measurementExists(newHash));

  if(await contract.measurementExists(newHash) ) {
    let val =  await contract.measurements(newHash);
    let valArray = hexToArray(val.data); 
    let valString = codesToString(valArray);
    //console.log(valString);
    data.push(JSON.parse(valString));
    console.log(data)
  }
});
setCurrentContractValue(data);
console.log("here");
  
console.log(currentContractValue);

  }

  return (
    <div className="Data">
      <div className="pfp"> </div>
      <div className="name">Josif Bezkosa</div>
      <div className="personal-id">1234567</div>
      <div>j1+ {currentContractValue}</div>
      {currentContractValue
      ?<>
        <Graph className="graph" title="temperature" data={currentContractValue}/>
        <Graph className="graph" title="oxygen" data={currentContractValue}/>
        <Graph className="graph" title="pulse" data={currentContractValue}/>
      </>
      :<></>  
      }
      <Field signer={props.signer} hash={props.high}/>

      {/* <button onClick={getHashes}>Batton</button> */}
      <div>{props.hash}</div>
      currentContractValue
    </div>
  )
}

export default Data;

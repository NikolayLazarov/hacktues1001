import styles from './EntryForm.module.css';
import React, { useState,useRef } from 'react';
import sha256 from 'js-sha256';
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";


import abi from"../../../contractDetails/MedicalStorage.json";
import address from "../../../contractDetails/address.json";
function UploadMeasurement(props){
    const navigate = useNavigate();
    const [fn,setFN] = useState("");
    const [ln,setLN] = useState("");
    const [pass,setPass] = useState("");
    const [egn,setEGN] = useState("");

    const [temperature,setTemperature] = useState(0);
    const [pulse,setPulse] = useState(0);
    const [oxygen,setOxygen] = useState(0);
    const hash = (string) => {
            return sha256(string).toString();
      }
    let contract;
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = tempProvider.getSigner();

    const medicalStorage = new ethers.Contract( address.medicalStorage , abi.abi , signer )
    
    const makeHash = () =>{
        let d = new Date();
        d = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
        const msg = fn+ln+egn+pass+d;
        const h = hash(msg);
        console.log(msg,h);
        return h;   
    }

    function stringToHex(str){
        var arr1 = ['0','x'];
        for (var n = 0, l = str.length; n < l; n ++){
            var hex = Number(str.charCodeAt(n)).toString(16);
            arr1.push(hex);
        }
        return arr1.join('');
      }
    
    const upload = async () => {
        event.preventDefault();
        let h = makeHash();
        h = stringToHex("0x"+h);
        console.log("hash"+h)
        let d = new Date();
        d = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        console.log(d);
        let data = stringToHex(JSON.stringify({temperature:parseInt(temperature),oxygen:parseInt(oxygen),pulse:parseInt(pulse),date:d}))
        console.log(data)
        console.log("start")
        await medicalStorage.addMeasurement(h,data);
        // console.log("added")
        // console.log(await medicalStorage.measurementExists(h))
        // console.log("exists")
        // const m = await medicalStorage.measurements(h)
        // console.log(m);
    }

    return <div >
        
        <form> 
            <h1>Entry Data</h1>
            <input type = "text" placeholder='First name' onChange={(event)=>{setFN(event.target.value)}}required/>
            <input type = "text" placeholder='Lastname' onChange={(event)=>{setLN(event.target.value)}} required/>
            <input style={styles.input}  type = "text" onChange={(event)=>{setEGN(event.target.value)}} placeholder ='Pesronal ID' required/>
            <input type = "password" placeholder='Password' onChange={(event)=>{setPass(event.target.value)}} required/>
            <div>
            <input type="number" placeholder='temperature' onChange={(event)=>{setTemperature(event.target.value)}} required/>
            <input type="number" placeholder='pulse' onChange={(event)=>{setPulse(event.target.value)}} required/>
            <input type="number" placeholder='oxygen' onChange={(event)=>{setOxygen(event.target.value)}} required/>


            </div>
            <button onClick={upload}>Submit</button>

            </form>
        </div>
    ;
}
export default UploadMeasurement;



 
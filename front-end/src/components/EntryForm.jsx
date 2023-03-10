import styles from './EntryForm.module.css';
import React, { useState,useRef } from 'react';
// import {createHash} from "crypto";
// import {sjcl} from 'sjcl'
import sha256 from 'js-sha256';
//import ethers from 'ethers';

// D:\NikiL\School\2022-2023\HackTues1001\Project\hacktues1001\contractDetails\address.json
// hacktues1001\contractDetails\address.json



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


function EntryForm(){

    const firstName = useRef();
    const lastName = useRef();
    const personalId = useRef();
    const password = useRef();
    const startingDate = useRef();
    const endingDate = useRef();

    function entryFormHandler(event){
        event.preventDefault();
      
        const startingDateFormated = dateFormater(startingDate.current.value);
        const endingDateFormated = dateFormater(endingDate.current.value);
       
        
        console.log(startingDateFormated);
        console.log(endingDateFormated);
        
        const finalStartingString = finalStringMaker(startingDateFormated);
        const finalEndingString = finalStringMaker(endingDateFormated);
        
        const hashStringStart = hashMaker(finalStartingString);
        console.log(hashStringStart);
        //metaMaskConnector(hashStringStart);
        return hashStringStart;
    }

    function dateFormater(date){
        const dateObject = new Date(date);
        const day =dateObject.getDate();
        const month =dateObject.getMonth ()+1;
        const year = dateObject.getFullYear();   
        return day + "\\" + month + "\\" + year; 
    }

    function finalStringMaker(formatedDate){
        const finalString = firstName.current.value + lastName.current.value + personalId.current.value + password.current.value + formatedDate;
        return finalString;
    }

    function hashMaker(newString){
        // const { createHash } = require('crypto');
        // const myBitArray = sjcl.hash.sha256.hash(newString);
        // const hash = sjcl.codec.hex.fromBits(myBitArray);
        const hash  = sha256(newString).toString();

        return hash;
    }


    
    return <div >
        
        <form onSubmit={entryFormHandler} > 
                <h1>Entry Data</h1>
                <input type = "text" placeholder='First name' ref={firstName} required/>
                <input type = "text" placeholder='Lastname' ref={lastName} required/>
            <input style={styles.input}  type = "text" placeholder ='Pesronal ID' ref={personalId} required/>
            <input type = "password" placeholder='Password' ref={password} required/>
            <div>
            <input type="date" ref={startingDate} required/>

            <input type="date" ref={endingDate} required/>

            </div>


            <button>Submit </button>

            </form>

        
        </div>
    ;
}
export default EntryForm;



 
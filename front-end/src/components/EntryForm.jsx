import styles from './EntryForm.module.css';
import React, { useState,useRef } from 'react';
import sha256 from 'js-sha256';
import { useNavigate } from "react-router-dom";

function EntryForm(props){
    const navigate = useNavigate();

    const [firstName,setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [personalId, setPersonlId] = useState();
    const [password, setPassword] = useState();
    const [startingDate, setStartingDate] = useState();
    const [endingDate,setEndingDate] = useState();
    const [hashes,setHashes] = useState([]);

    function entryFormHandler(event){
        event.preventDefault();
    
        const formatedDates = dateFormater(startingDate,endingDate);
        
        const finalStringsArray = finalStringMaker(formatedDates);
        
        const hashStringStart = hashMaker(finalStringsArray);

        props.setHashes(hashStringStart);
        props.setFirstName(firstName);
        props.setLastName(lastName);
        props.setPersonlId(personalId);
        props.setPassword(password);

        navigate("/Data");
        // return hashStringStart;
    }

    function dateFormater(dateStart, dateFinal){
        const dateObjectStart = new Date(dateStart);
        const dateObjectFinal = new Date(dateFinal);
        var daysOfYear = [];
        
        for (dateObjectStart; dateObjectStart <= dateObjectFinal; dateObjectStart.setDate(dateObjectStart.getDate() + 1)) {
                const day =dateObjectStart.getDate();
                const month =dateObjectStart.getMonth ()+1;
                const year = dateObjectStart.getFullYear(); 
            daysOfYear.push(day + "/" + month + "/" + year);   
        }
        
        return daysOfYear; 
    }

    function finalStringMaker(formatedDateArray){
        const finalStrings = []; 
        formatedDateArray.map((formatedData)=>{
            const finalString = firstName + lastName + personalId + password + formatedData;
                finalStrings.push(finalString);
        });
        return finalStrings;
        
    }

    function hashMaker(startingStrings){
        const hashes = [];
        startingStrings.map((newString)=>{
            console.log(newString);
            hashes.push(sha256(newString).toString());
        });
        console.log(hashes);

        return hashes;
    }

    return <div >
        
        <form onSubmit={(event)=> {entryFormHandler(event);} } > 
                <h1>Entry Data</h1>
                <input type = "text" placeholder='First name' onChange={(event)=>setFirstName(event.target.value)} required/>
                <input type = "text" placeholder='Lastname' onChange={(event)=>setLastName(event.target.value)}  required/>
            <input style={styles.input}  type = "text" placeholder ='Pesronal ID' onChange={(event)=>setPersonlId(event.target.value)} required/>
            <input type = "password" placeholder='Password' onChange={(event)=>setPassword(event.target.value)} required/>
            <div>
            <input type="date" onChange={(event)=>setStartingDate(event.target.value)} required/>

            <input type="date" onChange={(event)=>setEndingDate(event.target.value)} required/>

            </div>
            <button>Submit</button>

            </form>
        </div>
    ;
}
export default EntryForm;



 
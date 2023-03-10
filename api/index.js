const express = require('express')

const {ethers} = require("ethers");
const address = require("../contractDetails/address.json").medicalStorage;
const abi = require("../contractDetails/MedicalStorage.json").abi;
require('dotenv').config();

const provider = new ethers.providers.InfuraProvider(
    "goerli",
    process.env.INFURA_API_KEY
);
const signer = new ethers.Wallet(process.env.ACCOUNT_PRIVATE_KEY, provider);
const medicalStorage = new ethers.Contract( address , abi , signer )
  

const app = express()
const port = 3000
const hostname = '0.0.0.0';

const pushData = require('./controllers/pushData')
const makeTest = async (req,res) =>{
    const hash="0x12345678901234567890";
    console.log(await medicalStorage.measurementExists(hash))
    const d = await medicalStorage.measurements(hash)
    console.log(d);
    res.send("a")
}
app.use(express.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods','PUT, PATCH, DELETE, GET, POST');
        return res.status(200).json({})
    }
    next()
})


app.get('/date', (req, res) => {
    const date = new Date();
    let d = date.getDate().toString()+"/"
        +(date.getMonth()+1).toString()+"/"
        +date.getFullYear().toString()
    res.send(d)
})

app.post('/m', pushData)
app.get('/test', makeTest)

app.listen(port, hostname, () => {
  console.log(`Example app listening  ${hostname} on port ${port}`)
})

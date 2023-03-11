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
function stringToHex(str){
    var arr1 = ['0','x'];
    for (var n = 0, l = str.length; n < l; n ++){
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }
    return arr1.join('');
  }

const makeTest = async (req,res) =>{
    let hashes=[
        '2c92d67da3696015c2168db488d7bb89473db028780fc5338e10e989039975ca',
        '3fee93c4df3fc5c2e9b3c7d8c2b7ac3251b9904956433bb676ae2796a308bf26',
        '54a040c74649e13d3842115e082c08b851042375c3a0af49e2796b2d140f7e59',
        '12a7f9eea853ff53014fee2df8b92495f3613712f6d0ca2305a33038dbd28a7d',
        'e6ccdc9531a39914b1212283f0a284633ed2b2a5f63ce3ddd46d4fa5599ebbf9',
        'f9edd1310f90781580de25fceeb2abdf19b0eb921d55f6e50a43f177a327490b',
        '3226e726a3a10c5229f8d45f58b47fe1d24f334b9d9f92e6711fef32373e8778'
    ]
    let dates=[
        '2023-03-01',
        '2023-03-02',
        '2023-03-03',
        '2023-03-04',
        '2023-03-05',
        '2023-03-06',
        '2023-03-07',
    ]
    for(let i=0;i<7;i++){
        let h = stringToHex("0x"+hashes[i]);
        let d = stringToHex(JSON.stringify({temperature:30+i,oxygen:i,pulse:90+i,date:dates[i]}))
        console.log(d)
        console.log("start"+i)
        //await medicalStorage.addMeasurement(h,d);
        console.log("added")
        console.log(await medicalStorage.measurementExists(h))
        console.log("exists")
        const m = await medicalStorage.measurements(h)
        console.log(m);
    }
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

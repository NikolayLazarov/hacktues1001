const {ethers} = require("ethers");
const address = require("../contractDetails/address.json").medicalStorage;
const abi = require("../contractDetails/MedicalStorage.json").abi;
require('dotenv').config();

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


const provider = new ethers.providers.InfuraProvider(
    "goerli",
    process.env.INFURA_API_KEY
);
const signer = new ethers.Wallet(process.env.ACCOUNT_PRIVATE_KEY, provider);
const medicalStorage = new ethers.Contract( address , abi , signer )
  

module.exports = async function (req,res){
    let hash = hexToArray(req.body.hash);
    const temp = req.body.temperature;
    const o2 = req.body.oxygen;
    const pulse = req.body.pulse;
    const data = JSON.stringify({temp,o2,pulse,hash});
    console.log(data)
    try{
        await medicalStorage.addMeasurement(hash,data);
    }catch(e){
        console.log(e)
    }
    console.log(req.body)
    console.log("uploaded")

    res.send({"ok":1});
}


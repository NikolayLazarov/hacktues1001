const { expect } = require("chai");
const { createHash } = require('crypto');

const hash = (string) => {
  return createHash('sha256').update(string).digest('hex');
}

function stringToHex(str){
  var arr1 = ['0','x'];
  for (var n = 0, l = str.length; n < l; n ++){
      var hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
  }
  return arr1.join('');
}

describe("MedicalStorage", function () {

    let  medicalStorage;
    let accounts;
    beforeEach(async ()=>{

      accounts = await ethers.getSigners();
      
      const MedicalStorage = await ethers.getContractFactory("MedicalStorage");
      medicalStorage = await MedicalStorage.deploy();
    })
    it("test owner",async()=>{
      const addr = accounts[0].address
      console.log(addr);
      expect(await medicalStorage.owner()).to.equal(addr);
    });
    it("create measurement owner",async()=>{
      let id = stringToHex(hash("asd"));

      let data = stringToHex('{"a":1}')
      expect(await medicalStorage.measurementExists(id)).to.be.false;
      await expect(medicalStorage.addMeasurement(id,data)).to.be.revertedWith('Not medic');
      expect(await medicalStorage.connect(accounts[0]).addMedic(accounts[0].address)).to.not.throw;
      expect(await medicalStorage.addMeasurement(id,data)).to.not.throw;
      expect(await medicalStorage.measurementExists(id)).to.be.true;
      console.log(data)
      let res =(await medicalStorage.measurements(id));
      //console.log(res)
      console.log(res.data)
      expect(res.data).to.equal(data);


    });
    

    });

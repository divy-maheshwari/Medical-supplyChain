import React,{useState} from 'react';


const Manufacturer = ({account,supplyChain}) => {
  const [UPC,setUPC] = useState(null);
  const [ManufacturerID,setManufacturerID] = useState(null);
  const [FactoryName,setFactoryName] = useState(null);
  const [FactoryInformation,setFactoryInformation] = useState(null);
  const [FactoryLatitude,setFactoryLatitude] = useState(null);
  const [FactoryLongitude,setFactoryLongitude] = useState(null);
  const [MedicineNote,setMedicineNote] = useState(null);
  const [MedicinePrice,setMedicinePrice] = useState(null);
  

  const submitHandler1 = async (e) => {
      e.preventDefault(); 
      let data = await supplyChain.methods.makeMedicine(UPC,ManufacturerID,FactoryName,FactoryInformation,FactoryLatitude,FactoryLongitude,MedicineNote).send({from:account});
      console.log(data.transactionHash);
      if(data) await supplyChain.methods.tmake(UPC,data.transactionHash).send({from:account});
    }
    const submitHandler2 = async (e) => {
      e.preventDefault();
      let data = await supplyChain.methods.packMedicine(UPC).send({from:account});
      console.log(data);
      if(data) await supplyChain.methods.tpack(UPC,data.transactionHash).send({from:account});
    }
      const submitHandler3 = async (e) => {
        e.preventDefault();
      let data = await supplyChain.methods.sellMedicine(UPC,MedicinePrice).send({from:account});
        console.log(data);
        if(data) await supplyChain.methods.tsell(UPC,data.transactionHash).send({from:account});
      }
        const submitHandler4 = async (e) => {
          e.preventDefault();
        let data = await supplyChain.methods.shipMedicine(UPC).send({from:account});
          console.log(data);
          if(data) await supplyChain.methods.tship(UPC,data.transactionHash).send({from:account});
        }
  
    return (
      <div>
      <form onSubmit={e => submitHandler1(e)} style={{margin: "auto",width: "25%"}}>
       <div className="form-group ">
        <label htmlFor="UPC">UPC</label>
        <input type="number" className="form-control" name="UPC" id="UPC" onChange={event => setUPC(event.target.value)} aria-describedby="UPC" placeholder="Unique Number" required/>
        <small id="UPC" className="form-text text-muted">Put the unique Product Code.</small>
      </div>
      <div className="form-group ">
        <label htmlFor="ManufacturerID">ManufacturerID</label>
        <input type="text" className="form-control" name="ManufacturerID" onChange={event => setManufacturerID(event.target.value)} id="ManufacturerID" required/>
      </div>
      <div className="form-group ">
        <label htmlFor="FactoryName">FactoryName</label>
        <input type="text" className="form-control" name="FactoryName" onChange={event => setFactoryName(event.target.value)} id="FactoryName" required/>
      </div>
      <div className="form-group ">
        <label htmlFor="FactoryInformation">FactoryInformation</label>
        <input type="text" className="form-control" name="FactoryInformation" onChange={event => setFactoryInformation(event.target.value)} id="FactoryInformation" required/>
      </div>
      <div className="form-group ">
        <label htmlFor="FactoryLatitude">FactoryLatitude</label>
        <input type="text" className="form-control" name="FactoryLatitude" onChange={event => setFactoryLatitude(event.target.value)} id="FactoryLatitude" required/>
      </div>
      <div className="form-group ">
        <label htmlFor="FactoryLongitude">FactoryLongitude</label>
        <input type="text" className="form-control" name="FactoryLongitude" onChange={event => setFactoryLongitude(event.target.value)} id="FactoryLongitude" required/>
      </div>
      <div className="form-group ">
        <label htmlFor="medicineNotes">medicineNotes</label>
        <input type="text" className="form-control" name="medicineNotes" onChange={event => setMedicineNote(event.target.value)} id="medicineNotes" required/>
      </div>
      <button type="submit" className="btn btn-primary" value="1">Make</button>
    </form>

    <br></br>
    <div className="form-break"></div>

    <form onSubmit={e => submitHandler2(e)} style={{margin: "auto",width: "25%"}}>
       <div className="form-group ">
        <label htmlFor="UPC">UPC</label>
        <input type="number" className="form-control" name="UPC" id="UPC" onChange={event => setUPC(event.target.value)} aria-describedby="UPC" placeholder="Unique Number" required/>
        <small id="UPC" className="form-text text-muted">Enter the unique Product Code.</small>
      </div>
      <button type="submit" className="btn btn-primary" value="2">Pack</button>
      </form>

      <br></br>
      <div className="form-break"></div>

      <form onSubmit={e => submitHandler3(e)} style={{margin: "auto",width: "25%"}}>
       <div className="form-group ">
        <label htmlFor="UPC">UPC</label>
        <input type="number" className="form-control" name="UPC" id="UPC" onChange={event => setUPC(event.target.value)} aria-describedby="UPC" placeholder="Unique Number" required/>
        <small id="UPC" className="form-text text-muted">Enter the unique Product Code.</small>
      </div>
      <div className="form-group ">
        <label htmlFor="MedicinePrice">Price</label>
        <input type="number" className="form-control" name="MedicinePrice" id="MedicinePrice" onChange={event => setMedicinePrice(event.target.value)} aria-describedby="MedicinePrice" placeholder="Ether" required/>
        <small id="MedicinePrice" className="form-text text-muted">Put the medicine Price.</small>
      </div>
      <button type="submit" className="btn btn-primary" value="3">ForSale</button>
      </form>
      
      <br></br>
    <div className="form-break"></div>

    <form onSubmit={e => submitHandler4(e)} style={{margin: "auto",width: "25%"}}>
       <div className="form-group ">
        <label htmlFor="UPC">UPC</label>
        <input type="number" className="form-control" name="UPC" id="UPC" onChange={event => setUPC(event.target.value)} aria-describedby="UPC" placeholder="Unique Number" required/>
        <small id="UPC" className="form-text text-muted">Enter the unique Product Code.</small>
      </div>
      <button type="submit" className="btn btn-primary" value="4">Ship</button>
      </form>
    </div>
      );
}


export default Manufacturer;
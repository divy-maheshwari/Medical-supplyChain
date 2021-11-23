import React, { useState } from 'react';
import Web3 from 'web3';


const Patient = ({account,supplyChain}) => {
  
  const [UPC,setUPC] = useState(null);
  const [FactoryDetails,setFactoryDetails] = useState(null);
  const [MedicineDetails,setMedicineDetails] = useState(null);
  const [History,setHistory] = useState(null);

const submitHandler1 = async (e) => {
  e.preventDefault(); 
  let data = await supplyChain.methods.purchaseMedicine(UPC).send({from:account});
  console.log(data.transactionHash);
  if(data) await supplyChain.methods.tpurchase(UPC,data.transactionHash).send({from:account});
}
const submitHandler2 = async (e) => {
  e.preventDefault();
  let data = await supplyChain.methods.fetchMedicineBufferOne(UPC).call();
  setFactoryDetails(data);
  console.log(data);
}
  const submitHandler3 = async (e) => {
    e.preventDefault();
    let data = await supplyChain.methods.fetchMedicineBufferTwo(UPC).call();
    setMedicineDetails(data);
    console.log(data);
  }
    const submitHandler4 = async (e) => {
      e.preventDefault();
    let data = await supplyChain.methods.getArray(UPC).call();
    console.log(data);
   // setHistory(data);
    }
  
    return (
      <div>
      <form onSubmit={e => submitHandler1(e)} style={{margin: "auto",width: "25%"}}>
       <div className="form-group ">
        <label htmlFor="UPC">UPC</label>
        <input type="number" className="form-control" name="UPC" id="UPC" onChange={event => setUPC(event.target.value)} aria-describedby="UPC" placeholder="Unique Number" required/>
        <small id="UPC" className="form-text text-muted">Enter the unique Product Code.</small>
      </div>
      <button style={{marginRight:'16px'}} type="submit" className="btn btn-primary">Purchase</button>
      </form>

      <br></br>
    <div className="form-break"></div>

      <form onSubmit={e => submitHandler2(e)} style={{margin: "auto",width: "25%"}}>
       <div className="form-group ">
        <label htmlFor="UPC">UPC</label>
        <input type="number" className="form-control" name="UPC" id="UPC" onChange={event => setUPC(event.target.value)} aria-describedby="UPC" placeholder="Unique Number" required/>
        <small id="UPC" className="form-text text-muted">Enter the unique Product Code.</small>
        <button style={{marginRight:'16px'}} type="submit" className="btn btn-secondary">Factory Detail</button>
      </div> 
      </form>
      
      <br></br>
      <div className="form-break"></div>

      <form onSubmit={e => submitHandler3(e)} style={{margin: "auto",width: "25%"}}>
       <div className="form-group ">
        <label htmlFor="UPC">UPC</label>
        <input type="number" className="form-control" name="UPC" id="UPC" onChange={event => setUPC(event.target.value)} aria-describedby="UPC" placeholder="Unique Number" required/>
        <small id="UPC" className="form-text text-muted">Enter the unique Product Code.</small>
      </div>
      <button type="submit" className="btn btn-primary">MedicineDetails</button>
      </form>

      <br></br>
      <div className="form-break"></div>

      <button type="button" className="btn btn-primary" value="4" onClick={e => submitHandler4(e)} >History</button>
      <hr></hr>
      {
        FactoryDetails ? <div>
          <h1>Factory Details</h1>
          <ul className="list-group">
          <li className="list-group-item">ManufacturerID - {FactoryDetails.originManufacturerID}</li>
          <li className="list-group-item">FactoryName - {FactoryDetails.originFactoryName}</li>
          <li className="list-group-item"> FactoryInformation - {FactoryDetails.originFactoryInformation}</li>
          <li className="list-group-item">FactoryLatitude - {FactoryDetails.originFactoryLatitude}</li>
          <li className="list-group-item">FactoryLongitude - {FactoryDetails.originFactoryLongitude}</li>
          </ul>
          <hr></hr>
        </div>
        : <div></div>
      }
      {
        MedicineDetails ? <div>
          <h1>Medicine Details</h1>
          <ul className="list-group">
          <li className="list-group-item">medicineNotes - {MedicineDetails.medicineNotes}</li>
          <li className="list-group-item">medicinePrice - {MedicineDetails.medicinePrice} Ether</li>
          <li className="list-group-item">medicineState - {MedicineDetails.medicineState}</li>
          <li className="list-group-item">distributorID - {MedicineDetails.distributorID}</li>
          <li className="list-group-item">pharmacistID - {MedicineDetails.pharmacistID}</li>
          <li className="list-group-item">patientID - {MedicineDetails.patientID}</li>
          </ul>
          <hr></hr>
        </div>
        : <div></div>
      }
      {
        History ? <div>
          <h1>transaction History</h1>
          <ul className="list-group">
          {History.map(txn => {
            let bN = Web3.eth.getTransaction(txn).blockNumber;
            let dateTimeStamp = Web3.eth.getBlock(bN).timestamp;
            let d = new Date(dateTimeStamp * 1000);
            let s = d.toUTCString()
            s = s.substring(0,s.indexOf("GMT")) + "UTC";
            return (
              <li className="list-group-item">{s}</li>
            )
          })}
          </ul>
          <hr></hr>
        </div>
        : <div></div>
      }
      </div>
      );
}


export default Patient;
import React,{useState} from 'react';
import Web3 from 'web3';


const Distributer = ({account,supplyChain}) => {
  const [UPC,setUPC] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    let fin = await supplyChain.methods.fetchMedicineBufferTwo(UPC).call();
    console.log(fin);
    const data = await supplyChain.methods.buyMedicine(UPC).send({from:account,value:Web3.utils.toWei(fin.medicinePrice,'ether')});
    console.log(data);
    if(data) await supplyChain.methods.tbuy(UPC,data.transactionHash).send({from:account});

  }
  
    return (
      <div>
      <form onSubmit={e => submitHandler(e)} style={{margin: "auto",width: "25%"}}>
       <div className="form-group ">
        <label htmlFor="UPC">UPC</label>
        <input type="number" className="form-control" name="UPC" id="UPC" onChange={event => setUPC(event.target.value)} aria-describedby="UPC" placeholder="Unique Number" required/>
        <small id="UPC" className="form-text text-muted">Enter the unique Product Code.</small>
      </div>
      <button type="submit" className="btn btn-primary">Buy</button>
      </form>
      </div>
      );
}


export default Distributer;
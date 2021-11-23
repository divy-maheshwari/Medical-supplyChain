import React,{useState} from 'react';


const Pharmacist = ({account,supplyChain}) => {
  
  const [UPC,setUPC] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = await supplyChain.methods.receiveMedicine(UPC).send({from:account});
    console.log(data);
    if(data) await supplyChain.methods.trecieve(UPC,data.transactionHash).send({from:account});
  }
  
    return (
      <div>
      <form onSubmit={e => submitHandler(e)} style={{margin: "auto",width: "25%"}}>
       <div className="form-group ">
        <label htmlFor="UPC">UPC</label>
        <input type="number" className="form-control" name="UPC" id="UPC" onChange={event => setUPC(event.target.value)} aria-describedby="UPC" placeholder="Unique Number" required/>
        <small id="UPC" className="form-text text-muted">Enter the unique Product Code.</small>
      </div>
      <button type="submit" className="btn btn-primary">Recieve</button>
      </form>
      </div>
      );
}


export default Pharmacist;
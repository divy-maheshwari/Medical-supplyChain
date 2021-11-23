import React,{useState,useEffect} from 'react';
import SupplyChain from './build/contracts/SupplyChain.json';
import Navbar from './components/navbar';
import Distributer from './components/distributer';
import Manufacturer from './components/manufacturer';
import Pharmacist from './components/pharmacist';
import Patient from './components/patient';
import Web3 from 'web3';
import './App.css';

function App() {
  const [account,setAccount] = useState("0x000000000000000000000");
  const [supplychain,setSupplyChain] = useState(null);


useEffect(() => {
  loadWeb3();
  loadBlockchainData();
},[]);
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  async function loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0]);
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SupplyChain.networks[networkId]
    if(networkData) {
      const Chain = new web3.eth.Contract(SupplyChain.abi, networkData.address)
      setSupplyChain(Chain);
      console.log(supplychain);
   //   setLoading(false);
    } else {
      window.alert('Decentragram contract not deployed to detected network.')
    }
  }



  return (
    <div>
      <div className="container">
        <h1 style={{textAlign:"center"}}>Fair Trade Medicine</h1>
        <hr></hr>
        <p style={{textAlign:"center"}}>Prove the authenticity of medicine using the Ethereum blockchain.</p>
    </div>
      {account === "0x06e8A48a3bDEc373a2b702A467D03bc4B1ac6146" ? 
      <div>
        <Navbar account={account} role="Manufacturer"/>
        <Manufacturer account={account} supplyChain={supplychain}/>
      </div> :
      account === "0x3a18eb97AbaFF86a088A218972Bd4B8F437b6B2e" ?
      <div>
        <Navbar account={account} role="Distributer"/>
        <Distributer account={account} supplyChain={supplychain}/>
      </div> :
      account === "0x2bE3F56E06212730F5E04eb5666C503cEC817f93" ?
      <div>
        <Navbar account={account} role="Pharmacist"/>
        <Pharmacist account={account} supplyChain={supplychain}/>
      </div> :
      account === "0x3138D19eCA8588De950eAFE578A2d545037242bA" ?
      <div>
        <Navbar account={account} role="Patient"/>
        <Patient account={account} supplyChain={supplychain}/>
      </div> :
      <div>
        <Navbar account={account} role="Unknown"/>
        <h1 style={{textAlign:"center"}}>connect your account with MetaMask </h1>
        </div>
      }
    </div>

  );
}

export default App;

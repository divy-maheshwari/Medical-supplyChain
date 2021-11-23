// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "../medicineaccesscontrol/Roles.sol";
import "../medicineaccesscontrol/DistributorRole.sol";
import "../medicineaccesscontrol/ManufacturerRole.sol";
import "../medicineaccesscontrol/PatientRole.sol";
import "../medicineaccesscontrol/PharmacistRole.sol";
import "../medicinecore/Ownable.sol";

// Define a contract 'Supplychain'

contract SupplyChain is PharmacistRole, PatientRole, ManufacturerRole, DistributorRole {

  // Define 'owner'
  address owner;

  // Define a variable called 'upc' for Universal Product Code (UPC)
  uint  upc;

  // Define a variable called 'sku' for Stock Keeping Unit (SKU)
  uint  sku;

  // Define a public mapping 'medicines' that maps the UPC to a Medicine.
  mapping (uint => Medicine) medicines;

  // Define a public mapping 'medicinesHistory' that maps the UPC to an array of TxHash, 
  // that track its journey through the supply chain -- to be sent from DApp.
  mapping (uint => string[]) medicinesHistory;
  
  // Define enum 'State' with the following values:
  enum State 
  { 
    Made,       
    Packed,     
    ForSale,    
    Sold,       
    Shipped,    
    Received,   
    Purchased 
  }

  State constant defaultState = State.Made;

  // Define a struct 'Medicine' with the following fields:
  struct Medicine {
    uint    sku;  // Stock Keeping Unit (SKU)
    uint    upc; // Universal Product Code (UPC), generated by the Manufacturer, goes on the package, can be verified by the Patient
    address ownerID;  // Metamask-Ethereum address of the current owner as the medicine moves through 8 stages
    address originManufacturerID; // Metamask-Ethereum address of the Manufacturer
    string  originFactoryName; // Manufacturer Name
    string  originFactoryInformation;  // Manufacturer Information
    string  originFactoryLatitude; // Factory Latitude
    string  originFactoryLongitude;  // Factory Longitude
    uint    medicineID;  // Product ID potentially a combination of upc + sku
    string  medicineNotes; // Product Notes
    uint    medicinePrice; // Product Price
    State   medicineState;  // Product State as represented in the enum above
    address distributorID;  // Metamask-Ethereum address of the Distributor
    address pharmacistID; // Metamask-Ethereum address of the Pharmacist
    address patientID; // Metamask-Ethereum address of the Patient
  }

  // Define 8 events with the same 7 state values and accept 'upc' as input argument
  event Made(uint upc);
  event Packed(uint upc);
  event ForSale(uint upc);
  event Sold(uint upc);
  event Shipped(uint upc);
  event Received(uint upc);
  event Purchased(uint upc);

  // Define a modifer that checks to see if msg.sender == owner of the contract
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // Define a modifer that verifies the Caller
  // modifier verifyCaller (address _address) {
  //   require(msg.sender == _address); 
  //   _;
  // }

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) { 
    require(msg.value >= _price); 
    _;
  }
  
  // Define a modifier that checks the price and refunds the remaining balance
  // modifier checkValue(uint _upc) {
  //   _;
  //   uint _price = medicines[_upc].medicinePrice;
  //   uint amountToReturn = msg.value - _price;
  //   medicines[_upc].patientID.transfer(amountToReturn);
  // }

  // Define a modifier that checks if an medicine.state of a upc is Made
  modifier made(uint _upc) {
    require(medicines[_upc].medicineState == State.Made);
    _;
  }
  
  // Define a modifier that checks if an medicine.state of a upc is Packed
  modifier packed(uint _upc) {
    require(medicines[_upc].medicineState == State.Packed);

    _;
  }

  // Define a modifier that checks if an medicine.state of a upc is ForSale
  modifier forSale(uint _upc) {
    require(medicines[_upc].medicineState == State.ForSale);

    _;
  }

  // Define a modifier that checks if an medicine.state of a upc is Sold
  modifier sold(uint _upc) {
    require(medicines[_upc].medicineState == State.Sold);

    _;
  }
  
  // Define a modifier that checks if an medicine.state of a upc is Shipped
  modifier shipped(uint _upc) {
    require(medicines[_upc].medicineState == State.Shipped);

    _;
  }

  // Define a modifier that checks if an medicine.state of a upc is Received
  modifier received(uint _upc) {
    require(medicines[_upc].medicineState == State.Received);

    _;
  }

  // Define a modifier that checks if an medicine.state of a upc is Purchased
  modifier purchased(uint _upc) {
    require(medicines[_upc].medicineState == State.Purchased);
    _;
  }

  // In the constructor set 'owner' to the address that instantiated the contract
  // and set 'sku' to 1
  // and set 'upc' to 1
  constructor() payable {
    owner = msg.sender;
    sku = 0;
    upc = 0;
  }
  function getArray(uint _upc) onlyPatient public view returns (string[] memory) {
    return medicinesHistory[_upc];
}

  // Define a function 'kill' if required
  // function kill() public {
  //   if (msg.sender == owner) {
  //     selfdestruct(owner);
  //   }
  // }

  // Define a function 'makeMedicine' that allows a manufacturer to mark a medicine 'Made'
  function makeMedicine(uint _upc, address _originManufacturerID, string memory _originFactoryName, string memory _originFactoryInformation, string memory  _originFactoryLatitude, string memory  _originFactoryLongitude, string memory  _medicineNotes) public
  onlyManufacturer
  {
    // Add the new medicine as part of medicines
    Medicine memory temp_medicine = Medicine({
      sku:sku + 1,
      upc:_upc,
      ownerID:_originManufacturerID,
      originManufacturerID:_originManufacturerID,
      originFactoryName:_originFactoryName,
      originFactoryInformation:_originFactoryInformation,
      originFactoryLatitude:_originFactoryLatitude,
      originFactoryLongitude:_originFactoryLongitude,
      medicineID:sku+_upc,
      medicineNotes:_medicineNotes,
      medicineState:State.Made,
      medicinePrice:0,
      distributorID:address(0),
      pharmacistID:address(0),
      patientID:address(0)
      });
    medicines[_upc] = temp_medicine;
    medicines[_upc].medicineState = State.Made;

// uint    sku;  // Stock Keeping Unit (SKU)
//     uint    upc; // Universal Product Code (UPC), generated by the Manufacturer, goes on the package, can be verified by the Patient
//     address ownerID;  // Metamask-Ethereum address of the current owner as the medicine moves through 8 stages
//     address originManufacturerID; // Metamask-Ethereum address of the Manufacturer
//     string  originFactoryName; // Manufacturer Name
//     string  originFactoryInformation;  // Manufacturer Information
//     string  originFactoryLatitude; // Factory Latitude
//     string  originFactoryLongitude;  // Factory Longitude
//     uint    medicineID;  // Product ID potentially a combination of upc + sku
//     string  medicineNotes; // Product Notes
//     uint    medicinePrice; // Product Price
//     State   medicineState;  // Product State as represented in the enum above
//     address distributorID;  // Metamask-Ethereum address of the Distributor
//     address pharmacistID; // Metamask-Ethereum address of the Pharmacist
//     address patientID; // Metamask-Ethereum address of the Patient




    // Increment sku
    sku = sku + 1;
    // Emit the appropriate event

    emit Made(_upc);
  }

  function tmake(uint _upc,string memory txn) public onlyManufacturer{
    medicinesHistory[_upc].push(txn);
  }
   function tpack(uint _upc,string memory txn) public onlyManufacturer{
    medicinesHistory[_upc].push(txn);
  }
   function tsell(uint _upc,string memory txn) public onlyManufacturer{
    medicinesHistory[_upc].push(txn);
  }
   function tbuy(uint _upc,string memory txn) public onlyDistributor{
    medicinesHistory[_upc].push(txn);
  }
   function tship(uint _upc,string memory txn) public onlyManufacturer{
    medicinesHistory[_upc].push(txn);
  }
   function trecieve(uint _upc,string memory txn) public onlyPharmacist{
    medicinesHistory[_upc].push(txn);
  }
  function tpurchase(uint _upc,string memory txn) public onlyPatient{
    medicinesHistory[_upc].push(txn);
  }


  //  Define a function 'packMedicine' that allows a manufacturer to mark a medicine 'Packed'
  // Call modifier to check if upc has passed previous supply chain stage
  //   made(_upc)
  //  Call modifier to verify caller of this function
  function packMedicine(uint _upc) public made(_upc) onlyManufacturer
  {
    // Update the appropriate fields
    medicines[_upc].medicineState = State.Packed;

    // Emit the appropriate event
    emit Packed(_upc);
  }

  // Define a function 'sellMedicine' that allows a manufacturer to mark an medicine 'ForSale'
  // Call modifier to check if upc has passed previous supply chain stage
  // packed(_upc)
  // Call modifier to verify caller of this function
  function sellMedicine(uint _upc, uint _price) public packed(_upc) onlyManufacturer
  {
    // Update the appropriate fields
    medicines[_upc].medicineState = State.ForSale;
    medicines[_upc].medicinePrice = _price;
    // Emit the appropriate event
    emit ForSale(_upc);
  }

  // Define a function 'buyMedicine' that allows the distributor to mark a medicine 'Sold'
  // Use the above defined modifiers to check if the medicine is available for sale, if the buyer has paid enough, 
  // and any excess ether sent is refunded back to the buyer
  // Call modifier to check if upc has passed previous supply chain stage
  // forSale(_upc)
  // Call modifer to check if buyer has paid enough
  // paidEnough(medicines[_upc].medicinePrice)
  // Call modifer to send any excess ether back to buyer
  // checkValue(_upc)
  //limit to distributers , no end consumers are allowed to buy from factory.
  function buyMedicine(uint _upc) public payable forSale(_upc) paidEnough(medicines[_upc].medicinePrice) onlyDistributor
    {
      // Update the appropriate fields - ownerID, distributorID, medicineState
      medicines[_upc].medicineState = State.Sold;
      medicines[_upc].distributorID = msg.sender;
      // Transfer money to manufacturer

      payable(address(medicines[_upc].originManufacturerID)).transfer(msg.value);
      // emit the appropriate event
      emit Sold(_upc);
    }

  // Define a function 'shipMedicine' that allows the distributor to mark an medicine 'Shipped'
  // Use the above modifers to check if the medicine is sold
  // Call modifier to check if upc has passed previous supply chain stage
  // sold(_upc)
  // Call modifier to verify caller of this function
  function shipMedicine(uint _upc) public sold(_upc) onlyManufacturer 
    {
      //check if the factory is the one making this medicine.
      require(medicines[_upc].originManufacturerID == msg.sender,"Manufacturers can ship only medicines by them");
      // Update the appropriate fields
      medicines[_upc].medicineState = State.Shipped;
      // Emit the appropriate event
      emit Shipped(_upc);
    }

  // Define a function 'receiveMedicine' that allows the pharmacist to mark an medicine 'Received'
  // Use the above modifiers to check if the medicine is shipped
  // Call modifier to check if upc has passed previous supply chain stage
  // shipped(_upc)
  // Access Control List enforced by calling Smart Contract / DApp
  function receiveMedicine(uint _upc) public shipped(_upc) onlyPharmacist
    {
    // Update the appropriate fields - ownerID, pharmacistID, medicineState
    medicines[_upc].pharmacistID = msg.sender;
    medicines[_upc].medicineState = State.Received;

    // Emit the appropriate event
    emit Received(_upc);
  }

  // Define a function 'purchaseMedicine' that allows the patient to mark an medicine 'Purchased'
  // Use the above modifiers to check if the medicine is received
  // Call modifier to check if upc has passed previous supply chain stage
  // received(_upc)
  // Access Control List enforced by calling Smart Contract / DApp
  function purchaseMedicine(uint _upc) public received(_upc) onlyPatient  
    {
      // Up    medicines[_upc].medicineState = State.Shipped;
      medicines[_upc].patientID = msg.sender;
      medicines[_upc].medicineState = State.Purchased;
   //   medicines[_upc].distr.transfer(medicines[_upc].medicinePrice);
      // Emit the appropriate event
      emit Purchased(_upc);
    }

  // Define a function 'fetchMedicineBufferOne' that fetches the data
  function fetchMedicineBufferOne(uint _upc) public view returns 
  (
    address ownerID,
    address originManufacturerID,
    string memory  originFactoryName,
    string memory  originFactoryInformation,
    string memory  originFactoryLatitude,
    string memory  originFactoryLongitude
    ) 
  {
  // Assign values to the 7 parameters
  return 
  (
    medicines[_upc].ownerID,
    medicines[_upc].originManufacturerID,
    medicines[_upc].originFactoryName,
    medicines[_upc].originFactoryInformation,
    medicines[_upc].originFactoryLatitude,
    medicines[_upc].originFactoryLongitude
    );
}

  // Define a function 'fetchMedicineBufferTwo' that fetches the data
  function fetchMedicineBufferTwo(uint _upc) public view returns 
  (
    string memory  medicineNotes,
    uint    medicinePrice,
    State   medicineState,
    address distributorID,
    address pharmacistID,
    address patientID
    ) 
  {
    // Assign values to the 7 parameters
    return 
    (
      // medicines[_upc].originFactoryLongitude,
      medicines[_upc].medicineNotes,
      medicines[_upc].medicinePrice,
      medicines[_upc].medicineState,
      medicines[_upc].distributorID,
      medicines[_upc].pharmacistID,
      medicines[_upc].patientID
      );
  }

  // Define a function 'fetchMedicineBufferThree' that fetches the data
  function fetchMedicineBufferThree(uint _upc) public view returns 
  (
    uint    medicineSKU,
    uint    medicineUPC,
    uint    medicineID
    ) 
  {
    // Assign values to the 3 parameters    
    return 
    (
      medicines[_upc].sku,
      medicines[_upc].upc,
      medicines[_upc].medicineID      
      );
  }
}
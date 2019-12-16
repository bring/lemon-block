import React, {useEffect, useState} from 'react';
import './App.css';
import getWeb3 from "./getWeb3";
import TicketMasterABI from "./Contracts/TicketMaster"
import TicketMasterByteCode from "./Contracts/TicketMasterByteCode"
import {TICKET_MASTER_CONTRACT_ADDRESS} from "./Contants"

function SimpleStorageApp() {
    const [idToBuy, setIdToBuy] = useState(null);
    const [newOwner, setNewOwner] = useState(null);
    const [eventName, setEventName] = useState("Iron Maiden");
    const [price, setPrice] = useState(10000000);
    const [owner, setOwner] = useState("Ola");
    const [valueFromSmartContract, setValueFromSmartContract] = useState(null);
    const [web3Reference, setWeb3Reference] = useState(null);
    const [accountAddress, setAccountAddress] = useState(null);
    const [updateHistory, setUpdateHistory] = useState([]);
    const [deployedContractAddressList, setDeployedContractAddressList] = useState([TICKET_MASTER_CONTRACT_ADDRESS])
    const [selectedContractAddress, setSelectedContractAddress] = useState(deployedContractAddressList[0])
    const [successfulCreationOfContractMsg,setSuccessfulCreationOfContractMsg ] = useState(null)

    useEffect(() => {
        getWeb3()
            .then(web3 => {
                web3.eth.getAccounts()
                    .then(accounts => setAccountAddress(accounts[0]))
                setWeb3Reference(web3)
            });
    }, []);

    const sellTicket = async () => {
        let contract = new web3Reference.eth.Contract(TicketMasterABI, selectedContractAddress)
        contract
            .methods
            .sellTicket(eventName, price, owner)
            .send({from: accountAddress})
            .then((tx) => {
                console.log("Ticket sold successfully")
            })
    }

    const buyTicket = async () => {
        let contract = new web3Reference.eth.Contract(TicketMasterABI, selectedContractAddress)
        contract
            .methods
            .buyTicket(idToBuy, newOwner)
            .send({from: accountAddress})
            .then((tx) => {
                console.log("Ticket bought successfully")
            })
    }

    const getTicketCount = () => {
        let contract = new web3Reference.eth.Contract(TicketMasterABI, selectedContractAddress)
        contract
            .methods
            .getTicketCount()
            .call()
            .then((data) => {
                setValueFromSmartContract(data)
            })
    }

    function getEvents(eventName) {
        let simpleStorageContract = new web3Reference.eth.Contract(TicketMasterABI, selectedContractAddress)
        simpleStorageContract
            .getPastEvents(eventName, {
                fromBlock: 0,
                toBlock: 'latest'
            })
            .then((events) => setUpdateHistory(events.map(event => {
                return {
                    transactionHash: event.transactionHash,
                    blockNumber: event.blockNumber,
                    id: event.returnValues.id,
                    eventName: event.returnValues.eventName,
                    price: event.returnValues.price,
                    owner: event.returnValues.owner,
                    ownerAddress: event.returnValues.ownerAddress
                }
            }).sort((a, b) => a.id - b.id)))
    }

    const getTicketsSold = () => {
        getEvents('TicketSold');
    }

    const getAllTickets = () => {
        getEvents('NewTicket');
    }

    const deployAnotherInstance = () => {
        setSuccessfulCreationOfContractMsg(null)
        let contract = new web3Reference.eth.Contract(TicketMasterABI)
        let contractData = contract
            .deploy({data: '0x'+TicketMasterByteCode.object})
            .encodeABI()

        web3Reference
            .eth
            .sendTransaction({from: accountAddress, data: contractData})
            .then(tx => {
                setDeployedContractAddressList([tx.contractAddress].concat(deployedContractAddressList))
                setSuccessfulCreationOfContractMsg("Contract has been successfully created. Contract Address: "+tx.contractAddress)

            })
    }

    return (
        <div className="flexgrid mlm dib">
            { web3Reference !== null ? <div>
                <div className={"tc"}><h3>Welcome to the Ticket Master App.</h3>
                    <h6 className={"mlm"}> </h6>
                </div>
                <div style={{"marginLeft": "10rem"}} className={"mtl"}>

                    {successfulCreationOfContractMsg !== null ? <div className="message message--success mw7 pam mbl">
                        <div className="measure">
                            {successfulCreationOfContractMsg}
                        </div>
                    </div> : null}

                    Deployed Contracts
                    <select id="customerSelector" className="form__control"
                            onChange={(e) => setSelectedContractAddress(e.target.value)}>
                        {deployedContractAddressList.map((contract) => {
                            return <option value={contract}> {contract} </option>
                        })}
                    </select>

                    Event Name:
                    <input className={"form__control w-20"} type={"text"} value={eventName} onChange={(e) => setEventName(e.target.value)}
                           required/>
                    Price:
                    <input className={"form__control w-20"} type={"text"} value={price} onChange={(e) => setPrice(e.target.value)}
                           required/>
                    Owner:
                    <input className={"form__control w-20"} type={"text"} value={owner} onChange={(e) => setOwner(e.target.value)}
                           required/>
                    <button disabled={eventName === null} className={"btn btn--green mlm"}
                            onClick={() => sellTicket()}> Sell Ticket
                    </button>
                    <p>Buy tickets</p>
                    Id:
                    <input className={"form__control w-20"} type={"text"} onChange={(e) => setIdToBuy(e.target.value)}
                           required/>
                    New owner:
                    <input className={"form__control w-20"} type={"text"} onChange={(e) => setNewOwner(e.target.value)}
                           required/>
                    <button disabled={idToBuy === null} className={"btn btn--green mlm"}
                            onClick={() => buyTicket()}> Buy Ticket
                    </button>

                    <button className={"btn btn--green mlm"} onClick={() => getTicketCount()}> Total Tickets
                    </button>
                    <span className={"mlm"}>{valueFromSmartContract}</span>

                    <button className={"btn btn--green mlm"} onClick={() => getAllTickets()}> Show Tickets Offered
                    </button>
                    <button className={"btn btn--green mlm"} onClick={() => getTicketsSold()}> Show Ticket Sold
                    </button>
                    <button className={"btn btn--green mlm"} onClick={() => deployAnotherInstance()}> Create New Version
                    </button>
                    <br/>
                </div>

                {updateHistory.length !== 0 ? <table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Owner</th>
                        <th>Owner Account Address</th>
                    </tr>
                    </thead>
                    <tbody>
                    {updateHistory.map((update) => {
                        return <tr>
                            <td>
                                {update.id}
                            </td>
                            <td>
                                {update.name}
                            </td>
                            <td>
                                {update.price}
                            </td>
                            <td>
                                {update.owner}
                            </td>
                            <td>
                                {update.ownerAddress}
                            </td>
                        </tr>

                    })}

                    </tbody>

                </table> : null}


                <div>

                </div>
            </div> : <div> Waiting for web3 provider to be loaded ...</div>}
        </div>
    );
}

export default SimpleStorageApp;

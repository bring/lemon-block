import React, {useEffect, useState} from 'react';
import './App.css';
import getWeb3 from "./getWeb3";
import SimpleDonationABI from "./Contracts/SimpleDonation"
import SimpleDonationByteCode from "./Contracts/SimpleDonationByteCode"
import {SIMPLE_DONATION_CONTRACT_ADDRESS} from "./Contants"

function SimpleStorageApp() {
    const [donation, setDonation] = useState(null);
    const [donator, setDonator] = useState(null);
    const [valueFromSmartContract, setValueFromSmartContract] = useState(null);
    const [web3Reference, setWeb3Reference] = useState(null);
    const [accountAddress, setAccountAddress] = useState(null);
    const [updateHistory, setUpdateHistory] = useState([]);
    const [deployedContractAddressList, setDeployedContractAddressList] = useState([SIMPLE_DONATION_CONTRACT_ADDRESS])
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

    const sendToSmartContract = async () => {
        let contract = new web3Reference.eth.Contract(SimpleDonationABI, selectedContractAddress)
        contract
            .methods
            .donate(donation, donator)
            .send({from: accountAddress})
            .then((tx) => {
                console.log("Successfully Updated in Blockchain")
            })
    }

    const getStateFromSmartContract = () => {
        let contract = new web3Reference.eth.Contract(SimpleDonationABI, selectedContractAddress)
        contract
            .methods
            .getDonation()
            .call()
            .then((data) => {
                setValueFromSmartContract(data)
            })
    }

    const getUpdateHistory = () => {
        let simpleStorageContract = new web3Reference.eth.Contract(SimpleDonationABI, selectedContractAddress)
        simpleStorageContract
            .getPastEvents('NewDonation', {
                fromBlock: 0,
                toBlock: 'latest'
            })
            .then((events) => setUpdateHistory(events.map(event => {
                return {
                    transactionHash: event.transactionHash,
                    blockNumber: event.blockNumber,
                    donation: event.returnValues.donation,
                    donator: event.returnValues.donator
                }
            }).sort((a, b) => b.blockNumber - a.blockNumber)))
    }

    const deployAnotherInstance = () => {
        setSuccessfulCreationOfContractMsg(null)
        let contract = new web3Reference.eth.Contract(SimpleDonationABI)
        let contractData = contract
            .deploy({data: '0x'+SimpleDonationByteCode.object})
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
                <div className={"tc"}><h3>Welcome to the basic demonstration of Smart Contract Interaction.</h3>
                    <h6 className={"mlm"}>For this demonstration, We have created a basic smart contract that allow us
                        to update state of a
                        variable which is part of the smart contract and get state for the same </h6>
                </div>
                <div style={{"marginLeft": "30rem"}} className={"mtl"}>

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

                    <input className={"form__control w-20"} type={"text"} onChange={(e) => setDonation(e.target.value)}
                           required/>
                    <input className={"form__control w-20"} type={"text"} onChange={(e) => setDonator(e.target.value)}
                           required/>
                    <button disabled={donation === null} className={"btn btn--green mlm"}
                            onClick={() => sendToSmartContract()}> Set Value
                    </button>
                    <span> (Initiate a Transaction towards block chain)</span>
                    <br/>
                    <button className={"btn btn--green mlm"} onClick={() => getStateFromSmartContract()}> Get Value
                    </button>
                    <span className={"mlm"}>{valueFromSmartContract}</span>
                    <br/>
                    <button className={"btn btn--green mlm"} onClick={() => getUpdateHistory()}> Show update history
                    </button> (Retrieve Event history for a specific event "NewValueAssigned")
                    <br/>

                    <button className={"btn btn--green mlm"} onClick={() => deployAnotherInstance()}> Create New Version
                    </button> (Initiate a Transaction towards block chain)
                    <br/>
                </div>

                {updateHistory.length !== 0 ? <table>
                    <thead>
                    <tr>
                        <th>Transaction Reference</th>
                        <th>Block Number</th>
                        <th>Donation</th>
                        <th>Donator</th>
                    </tr>
                    </thead>
                    <tbody>
                    {updateHistory.map((update) => {
                        return <tr>
                            <td>
                                {update.transactionHash}
                            </td>
                            <td>
                                {update.blockNumber}
                            </td>
                            <td>
                                {update.donation}
                            </td>
                            <td>
                                {update.donator}
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

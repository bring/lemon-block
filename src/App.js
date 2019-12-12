import React, {useEffect, useState} from 'react';
import './App.css';
import getWeb3 from "./getWeb3";
import SimpleStorageABI from "./Contracts/SimpleStorage"
import {SIMPLE_STORAGE_CONTACT_ADDRESS} from "./Contants"

function App() {
    const [value, setValue] = useState(null);
    const [valueFromSmartContract, setValueFromSmartContract] = useState(null);
    const [web3Reference, setWeb3Reference] = useState(null);
    const [accountAddress, setAccountAddress] = useState(null);
    const [updateHistory, setUpdateHistory] = useState([]);


    useEffect(() => {
        getWeb3()
            .then(web3 => {
                web3.eth.getAccounts()
                    .then(accounts => setAccountAddress(accounts[0]))
                setWeb3Reference(web3)
            });
    }, []);

    const sendToSmartContract = async  () => {
        let simpleStorageContract = new web3Reference.eth.Contract(SimpleStorageABI, SIMPLE_STORAGE_CONTACT_ADDRESS)
        simpleStorageContract
            .methods
            .set(value)
            .send({from: accountAddress})
            .then((tx) => {
                console.log("Successfully Updated in Blockchain")
            })
    }

    function getStateFromSmartContract() {
        let simpleStorageContract = new web3Reference.eth.Contract(SimpleStorageABI, SIMPLE_STORAGE_CONTACT_ADDRESS)
        simpleStorageContract
            .methods
            .get()
            .call()
            .then((data) => setValueFromSmartContract(data) )
    }

    function getUpdateHistory() {
        let simpleStorageContract = new web3Reference.eth.Contract(SimpleStorageABI, SIMPLE_STORAGE_CONTACT_ADDRESS)
        simpleStorageContract
            .getPastEvents('NewValueAssigned', {
                fromBlock: 0,
                toBlock: 'latest'
            })
            .then((events) => setUpdateHistory(events.map(event => {
                return {
                    transactionHash: event.transactionHash,
                    blockNumber: event.blockNumber,
                    value: event.returnValues.value
                }
            }).sort((a, b) => b.blockNumber - a.blockNumber)))
    }
    return (
        <div className="flexgrid mlm dib">
            {web3Reference !== null ? <div>
                <div className={"tc"}><h3>Welcome to the basic demonstration of Smart Contract Interaction.</h3>
                <h6 className={"mlm"}>For this demonstration, We have created a basic smart contract that allow us to update state of a
                    variable which is part of the smart contract and get state for the same </h6>
                </div>
                <div style={{"marginLeft":"30rem"}} className={"mtl"}>
                  <input className={"form__control w-20"} type={"text"} onChange={(e) => setValue(e.target.value)} required/>
                    <button disabled={value === null } className={"btn btn--green mlm"} onClick={() => sendToSmartContract()}> Set Value</button> <span>(Initiate a Transaction towards block chain)</span>
                    <br/>
                    <button className={"btn btn--green mlm"} onClick={() => getStateFromSmartContract()}> Get Value</button> <span className={"mlm"}>{valueFromSmartContract}</span>
                    <br/>
                  <button className={"btn btn--green mlm"} onClick={() => getUpdateHistory()}> Show update history</button> (Retrieve Event history for a specific event "NewValueAssigned")
                    <br/>
                </div>

                    {updateHistory.length !== 0 ? <table>
                        <thead>
                        <tr>
                            <th>Transaction Reference</th>
                            <th>Block Number</th>
                            <th>Value</th>
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
                                    {update.value}
                                </td>
                            </tr>

                        })}

                        </tbody>

                    </table> : null}


                <div >

                </div>
            </div> : <div> Waiting for web3 provider to be loaded ...</div>}
        </div>
    );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SimpleStorageApp from './SimpleStorageApp';
import SimpleDonationApp from './SimpleDonationApp';
import TicketMaster from './TicketMaster'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<TicketMaster />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

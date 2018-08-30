import React, { Component } from 'react';
import './App.css';
import web3latest from './web3';

class App extends Component {

  state = {
    contract: {},
    payingAccount: "",
    fundedAccount: "",
    available: false,
    badAddrs: false
  }

  componentDidMount() {
    let paying;
    let contract;
    let available;

    web3latest.eth.getAccounts().then((accounts) => {
      paying = accounts[0];
      return new web3latest.eth.Contract([{ "constant": false, "inputs": [], "name": "updateAvailable", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "available", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_reciever", "type": "address" }], "name": "fundAccount", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" }],
        "0xf4fcf969983f829cb4970094b930b3a6045a636a")
    }).then((instance) => {
      contract = instance;

      return contract.methods.available().call({ from: paying })
    }).then((result) => {
      available = result;

      this.setState({ contract, available, payingAccount: paying });
    })

  }

  fundAccount() {
    if (web3latest.utils.isAddress(this.state.fundedAccount)) {

      this.state.contract.methods.fundAccount(this.state.fundedAccount).send({ from: this.state.payingAccount }).then((result) => {
        this.setState({ badAddrs: false, fundedAccount: "" });
        console.log('exito', result);

      }).catch(e => {
        console.log('error');

      });
    } else {
      console.log('bad addrs');
      this.setState({ badAddrs: true });

    }

  }

  onUpdateHandler(event) {
    this.setState({ fundedAccount: event.target.value });
  }

  render() {
    let disp;
    if (!this.state.available) {
      disp = <h1>El faucet no se encuentra activo, intente más tarde</h1>;
    } else {
      let warn = null;
      if (this.state.badAddrs) {
        warn = <h2>Revise que su billetera este bien escrita (copiar y pegar es la mejor opcion) </h2>
      }
      disp = <div><h1>Ingrese la direccion de su billetera</h1>
        {/* <input id="newWallet" className="form-control" type="text" placeholder="0xap13jnh39873najo3h3" onChange={(e) => this.onUpdateHandler(e)} value={this.state.fundedAccount} />
        <button onClick={() => { this.fundAccount() }}>Enviar Fondos</button> */}
        <p />
        <div className="col-xl">
        <input id="newWallet" className="form-control" type="text" placeholder="0xap13jnh39873najo3h3" onChange={(e) => this.onUpdateHandler(e)} value={this.state.fundedAccount} />
        </div>
        <div className="col-xl">
        <button type="submit" className="btn btn-primary btn-block" onClick={() => { this.fundAccount() }}>Enviar Fondos</button>
        </div>
        {warn}
      </div>
    }
    return (
      <div className="App">
        {disp}
        <script src="https://cdn.rawgit.com/ethereum/web3.js/develop/dist/web3.js"></script>
      </div>
    );
  }
}

export default App;

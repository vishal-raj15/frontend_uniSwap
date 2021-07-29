import {useState} from 'react';
import { ethers} from 'ethers';
import './App.css';

import token from './artifacts/Token1.json'; 
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; //address of the token1 contract
const factoryAddress= "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const routerAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const WETHAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";


// Nothing to compile
// reusing "Token1" at 0x5FbDB2315678afecb367f032d93F642f64180aa3
// reusing "UniswapV2Factory" at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// reusing "WETH9" at 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// reusing "UniswapV2Router02" at 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9



function App() {
  const [userAccount, setUserAccount] = useState(null)
  const [amount, setAmount] = useState()
  const [balance , setBalance] = useState("")


  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log( " provider ", {provider})
     const contract = new ethers.Contract(tokenAddress, token.abi, provider)
      const balance = await contract.balanceOf(account);
      setUserAccount(account);
      console.log("Balance: ", balance.toString());
      console.log( " account " , account);
      
      setBalance(balance.toString());
    }

    
  }

  return (
    <div className="App">
      <p> hello token1</p>
       <button onClick={getBalance}>Get Balance</button>
       
        { userAccount ? 
          <div><p> {userAccount}</p> <p> balance of the user is :</p> <p>{balance}</p></div>:
          <p></p>
          }
    </div>
  );
}

export default App;

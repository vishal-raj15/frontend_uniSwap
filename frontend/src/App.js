import {useState} from 'react';
import { ethers , BigNumber} from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';
import './App.css';

import token1 from './artifacts/Token1.json'; 
import token2 from './artifacts/Token2.json';
import router from './artifacts/router02.json';
import Factory from './artifacts/Factory.json';

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; //address of the token1 contract
const token2Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const factoryAddress= "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const routerAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const WETHAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// import contracts from './contracts/hardhat_contracts.json'; 
// const token1 = contracts[31337].localhost.contracts.Token1
// const token2 = contracts[31337].localhost.contracts.Token2
// const Factory = contracts[31337].localhost.contracts.UniswapV2Factory
// const router = contracts[31337].localhost.contracts.UniswapV2Router02

const overrides = {
  gasLimit: 9999999
}

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

function App() {
  const [userAccount, setUserAccount] = useState()
  const [recAccount, setRecAccount] = useState()
  const [amount, setAmount] = useState()
  const [balancetk1 , setBalancetk1] = useState("")
  const [balancetk2 , setBalancetk2] = useState("")
  const [token1Amount , setAmounttk1] = useState(0)
  const [token2Amount , setAmounttk2] = useState(0)


  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log( " provider ", {provider})
      console.log( " Account " , account);

      const tk1 = new ethers.Contract(token1.address, token1.abi, provider)
      const balancetk1 = await tk1.balanceOf(account);
      setUserAccount(account);
      console.log(" Balance Token1: ", balancetk1.toString());
      setBalancetk1(balancetk1.toString());

      const tk2 = new ethers.Contract(token2.address, token2.abi, provider)
      const balancetk2 = await tk2.balanceOf(account);
      setUserAccount(account);
      console.log(" Balance Token2: ", balancetk2.toString());
      setBalancetk2(balancetk2.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(" signer ", signer)
      const contract = new ethers.Contract(token1.address, token1.abi, signer)
      const transation = await contract.transfer(recAccount, expandTo18Decimals(amount));
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${recAccount}`);
    }
  }

  async function addLiquidity() {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tk1 = new ethers.Contract(token1.address, token1.abi, signer)
    const tk2 = new ethers.Contract(token2.address, token2.abi, signer)
    const r02 = new ethers.Contract(router.address, router.abi, signer)
    const factory = new ethers.Contract(Factory.address, Factory.abi, signer)

    await factory.createPair(tk1.address, tk2.address)
    await tk1.approve(router.address, MaxUint256)
    await tk2.approve(router.address, MaxUint256)
    await r02.addLiquidity(
      token1.address,
      token2.address,
      token1Amount,
      token2Amount,
      token1Amount,
      token2Amount,
      account,
      MaxUint256,
      overrides
    )
  }

  return (
    <div className="App">
      <p> hello user</p>
      <button onClick={getBalance}>Get Balance</button>
        { userAccount ? 
          <div>
            <p> {userAccount}</p>
            <p> balance TK1 :  {balancetk1}</p>
            <p> balance TK2 :  {balancetk2}</p>
          </div>:
          <p></p>
        }
        <p> Send TK1 to someone :</p>
        
        <input onChange={e => setRecAccount(e.target.value)} placeholder="Account ID" />
        <br></br>
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <br></br>
        <button onClick={sendCoins}>Send Token1</button>
<br></br><br></br>

        <input onChange={e => setAmounttk1(expandTo18Decimals(e.target.value))} placeholder="Amount TK1" />
        <br></br>
        <input onChange={e => setAmounttk2(expandTo18Decimals(e.target.value))} placeholder="Amount TK2" />
        <br></br>
        <button onClick={addLiquidity}>Add Liquidity</button>
    </div>
  );
}

export default App;



// // Nothing to compile
// // reusing "Token1" at 0x5FbDB2315678afecb367f032d93F642f64180aa3
// // reusing "UniswapV2Factory" at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// // reusing "WETH9" at 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// // reusing "UniswapV2Router02" at 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9



// function App() {
//   const [userAccount, setUserAccount] = useState(null)
//  // const [amount, setAmount] = useState()
//   const [balance , setBalance] = useState("")
//   const [token2balance , setToken2balance] = useState("")
//   const [ tk1amount , setTk1amount] = useState(0)
//   const [tk2amount , setTk2amount] = useState(0)
//   const [inputtk1 , setInputtk1] = useState(0)
//   const [friendaccount , setFriendaccount] = useState("")

//   const overrides = {
//     gasLimit: 9999999
//   }
//   function expandTo18Decimals(n) {
//     return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
//   }

//   async function requestAccount() {
//     await window.ethereum.request({ method: 'eth_requestAccounts' });
//   }


//   async function getBalance() {
//     if (typeof window.ethereum !== 'undefined') {
//       const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
//       const provider = new ethers.providers.Web3Provider(window.ethereum);


//      const contract = new ethers.Contract(tokenAddress, token.abi, provider)
//       const balance = await contract.balanceOf(account);
//       setUserAccount(account);
//       console.log("Balance: ", balance.toString());
//       console.log( " account " , account);
//       console.log( " provider.getsigner() : ", provider.getSigner());
      
//       setBalance(balance.toString());

//       const contract2 = new ethers.Contract(token2Address, token2.abi, provider)
//       const balance2 = await contract2.balanceOf(account);
//      // setUserAccount(account);
//       console.log("Balance2 : ", balance2.toString());
//       //console.log( " account " , account);
      
//       setToken2balance(balance2.toString());
      
//     }

    
//   }

//   async function sendCoins() {
    
//     if (typeof window.ethereum !== 'undefined') {
//       await requestAccount()
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
      
//       const contract = new ethers.Contract(token.address, token.abi, signer)
//      const transation = await contract.transfer(friendaccount, inputtk1);
//      await transation.wait();
//     // console.log(`${inputtk1} Coins successfully sent to ${friendaccount}`);

//      try {
//       console.log(`${inputtk1} Coins successfully sent to ${friendaccount}`);

//       } catch (e) {
//       console.log(e)
//       }
//     }
//   }

//   const addLiquidity = async ( ) => {

//   }


//   return (
//     <div className="App">
//       <p> hello token1</p>
//        <button onClick={getBalance}>Get Balance</button>
       
//         { userAccount ? 
//           <div><p> {userAccount}</p> <p> balance of TK1 is :</p> <p>{balance}</p> <p>bal of TK2 is :</p> <p> {token2balance}</p></div>:
//           <p></p>
//           }


//         <div>

//           Send TK1 token :
//           <form>
//             <input
//             value={inputtk1}
//             onChange={e => setInputtk1(e.target.value)}
//             placeholder="TK1 Amount"
//             type="number"
//             name="inputtk1"
//             required
//           />
//           <br></br>
//             <input
//               value={friendaccount}
//               onChange={e => setFriendaccount(e.target.value)}
//               placeholder="Friend address"
//               type="text"
//               name="friendaccount"
//               required
//             />
//             <br></br>
//             <button onClick={sendCoins}>Send Token1</button>
//         </form>
//         </div>

//       <div>
//          add liquidity

//         <form>
//           <input
//           value={tk1amount}
//           onChange={e => setTk1amount(e.target.value)}
//           placeholder="TK1 Amount"
//           type="number"
//           name="tk1amount"
//           required
//         />
//         <br></br>
//           <input
//             value={tk2amount}
//             onChange={e => setTk2amount(e.target.value)}
//             placeholder="TK2 Amount"
//             type="number"
//             name="tk2amount"
//             required
//           /><br></br>
//           <button onClick={sendCoins}>Add liquidity</button>
//         </form>

//           <p> {tk1amount}</p>
          
//           <p> {tk2amount}</p>
         
//       </div>
//     </div>
//   );
// }

// export default App;

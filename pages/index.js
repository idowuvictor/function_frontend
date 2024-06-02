import {useState, useEffect} from "react";
import {ethers} from "ethers";
import namekeeper_abi from "../artifacts/contracts/namekeeper.sol/Namekeeper.json";

export default function HomePage() {

  const inputBox = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid blue',


  };

  const btn = {
    backgroundColor: 'blue',
    color: 'white',
    fontSize: '18px',
    border: 'none',
    fontWeight: 'bold',
    padding: '10px',
    borderRadius: '5px',
    margin: '5px'
  };



  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [namekeeper, setNamekeeper] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [userName, setuserName] = useState('');
  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const nameABI = namekeeper_abi.abi;



  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account[0]);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account[0]);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getnamekeepercontract();
  };

  const getnamekeepercontract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, nameABI, signer);
 
    setNamekeeper(atmContract);
  }

  const getBalance = async() => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    if (namekeeper) {
      setBalance(parseFloat(ethers.utils.formatEther(await provider.getBalance(account))).toFixed(2));
    }
    
  }

  const setName = async() => {
    setSuccess(undefined);
    setError(undefined);
    if (namekeeper) {
      try {
        console.log("user name", userName);
        console.log(namekeeper, "namekeeper")
        let tx = await namekeeper.setname(userName);
        await tx.wait()
        setSuccess("Name set successfully")
      } catch (error) {
        console.log(error);
        setError(error.message.split(":")[0]);
      }
    }
  }

  const getname = async() => {
    setSuccess(undefined);
    setError(undefined);
    if (namekeeper) {
      try {
        let tx = await namekeeper.getname();
        setSuccess(tx)
      } catch (error) {
        console.log(error.errorArgs[0]);
        setError(error.errorArgs[0]);
      }
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this namekeeper.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account.slice(0, 6) + "..." + account.slice(-4)}</p>
        <p>Your Balance: {balance}</p>

        <div>
         { success ? <p style={{color: 'green'}}>{success}</p> : <p style={{color:  "red"}}>{error}</p> }
        </div>

        <div className="">
          <input id="userName" type="text" style={inputBox} placeholder="0xBamigboye" value={userName}
          onChange={(e) => setuserName(e.target.value)} required />

        <span className>
           <button onClick={setName} style={btn}>Set Name</button>
        </span>
      </div>

        <br /> 
        <button onClick={getname} style={btn}>Get Name</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to Name Keeper!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
import "./App.css";
import Web3 from "web3";
import { useEffect, useState, useCallback } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState(null);
  const [shouldReload, setShouldReload] = useState(false);

  const canConnectToContract= account && web3Api.contract
  const reloadEffect = useCallback(
    () => setShouldReload(!shouldReload),
    [shouldReload]
  );

  const setAccountListener = (provider) => {
    // provider.on("accountsChanged", (accounts) => setAccount(accounts[0]));
    provider.on("chainChanged", _ => window.location.reload());
  };

  useEffect(() => {
    //manage provider with '@metamask/detect-provider package
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
        console.log("Ethereum successfully detected!");
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3Api((prevState) => {
          return { ...prevState, isProviderLoaded: true };
        });
        console.error("Please install MetaMask!");
      }
    };

    //manually managing provider
    //     const loadProvider=async ()=>{
    //       let provider=null;
    //       if(window.ethereum){
    //         provider=window.ethereum
    //         try{
    //           // await provider.enable()  deprecated
    //           await provider.request({method:"eth_requestAccounts"})
    //         }catch{
    //           console.log("User denied access")
    //         }
    //       }else if(window.web3){
    //         provider=window.web3.currentProvider
    //       }
    //       else if(!process.env.production){
    //         provider=new Web3.providers.HttpProvider("http://localhost7545")
    //       }
    // setWeb3Api({
    //   web3:new Web3(provider),
    //   provider,
    // })
    //     }
    loadProvider();
  }, []);
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
      reloadEffect();
    };
    web3Api.web3 && getAccounts();
  }, [web3Api.web3, shouldReload, reloadEffect]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    // window.location.reload()
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, {
      from: account,
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);
    const  killRequest=async ()=> {
    try {
      await web3Api.provider.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      console.log('Request successfully cancelled.');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {web3Api.isProviderLoaded ? (
            <div className="is-flex is-align-items-center ">
              <span className="mr-2">
                <strong>Account:</strong>{" "}
              </span>
              {account ? (
                <h1>{account}</h1>
              ) : !web3Api.provider && web3Api.isProviderLoaded ? (
                <>
                  <div className="notification is-warning is-small is-rounded">
                    wallet is not detected!
                    <a
                      without
                      rel="noreferrer"
                      target="_blank"
                      className="ml-1"
                      href="https://docs.metamask.io"
                    >
                      {" "}
                      Install Metamask
                    </a>
                  </div>
                </>
              ) : (
                <button
                  className="button "
                  onClick={async () => {
                    try{
                    await web3Api.provider.request({
                      method: "eth_requestAccounts",
                    });}catch{
                      killRequest()
                    }
                  }}
                >
                  Connect wallet
                </button>
              )}
            </div>
          ) : (
            <span>Looking for web3...</span>
          )}

          <div className="balance-view is-size-2 mb-2">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {!canConnectToContract&&<span className="is-block">Connect to Ganache</span>}
          <button
            disabled={!canConnectToContract}
            onClick={addFunds}
            className="button is-link  mr-2"
          >
            Donate 1 ETH
          </button>
          <button
            disabled={!canConnectToContract}
            onClick={withdraw}
            className="button is-primary "
          >
            Withdraw 0.1 ETH
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

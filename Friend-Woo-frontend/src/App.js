import './styles/App.css';
import React, { useEffect, useState } from 'react';
import contract from './contracts/FriendWoo.json';
import { ethers } from 'ethers';
import wooImg from './assets/woo.png';
import { Fragment } from 'react/cjs/react.production.min';
import Footer from './components/Footer';
import Header from './components/Header';

// 상수
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/my-friend-woo';
const contractAddress = "0x1D67c2418A018E60cfD8ae5bf67C66983a1004eb";
const abi = contract.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamaskError] = useState(null);
  const [mineStatus, setMineStatus] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNft = async () => {
    try {

      setMineStatus('mining');

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") });

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setMineStatus('success');

      } else {
        setMineStatus('error')
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      setMineStatus('error')
      console.log(err);
    }
  }

  useEffect(() => {
    checkWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }
  }, [])

  // Render Methods
  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    );
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNft} className='cta-button connect-wallet-button'>
        Mint a Woo NFT
      </button>
    );
  }



  return (
    <Fragment>
      {metamaskError && <div className='metamask-error'>Please make sure you are connected to the Rinkeby Network on Metamask!</div>}
      <div className="App">

        <div className='container'>
          <Header opensea={OPENSEA_LINK} />
          <div className="header-container">
            <div className='banner-img'>
              <img src={wooImg} alt="Woo" />
            </div>
            {currentAccount && mineStatus !== "mining" && mintNftButton()}
            {!currentAccount && !mineStatus && connectWalletButton()}
            <div className='mine-submission'>
              {mineStatus === 'success' && <div className={mineStatus}>
                <p>NFT minting successful!</p>
                <p className='success-link'>
                  <a href={`https://testnets.opensea.io/${currentAccount}/`} target='_blank' rel='noreferrer'>Click here</a>
                  <span> to view your NFT on OpenSea.</span>
                </p>
              </div>}
              {mineStatus === 'mining' && <div className={mineStatus}>
                <div className='loader' />
                <span>Transaction is mining</span>
              </div>}
              {mineStatus === 'error' && <div className={mineStatus}>
                <p>Transaction failed. Make sure you have at least 0.01 Rinkeby ETH in your Metamask wallet and try again.</p>
              </div>}
            </div>
          </div>
        </div>
        <div>
          <Footer address={contractAddress} />
        </div>
      </div>
    </Fragment >
  )
}

export default App;

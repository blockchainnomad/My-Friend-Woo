import React, { Fragment, useState, createContext, useEffect } from "react";
import Box from '@mui/material/Box';
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

import { ethers } from "ethers";
import WalletModal from "./modals/WalletModal";
import { isEmpty } from "lodash";

import artifact from "./contracts/Woo.json";

import { RPC_ENDPOINT_RINKEBY_ALCHEMY } from "./utils/constants";
import WooList from "./list/WooList";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Context = createContext();
const Provider = Context.Provider;


function App() {

    const CONNECT_TEXT = "connect wallet";
    const DISCONNECT_TEXT = "disconnect";

    const [open, setOpen] = useState(false);
    const [web3, setWeb3] = useState({});

    const [account, setAccount] = useState("0x");
    const [balance, setBalance] = useState("0");
    const [btnText, setBtnText] = useState(CONNECT_TEXT);

    const [wooNft, setWooNft] = useState(null);

    const defaultProvider = ethers.getDefaultProvider(RPC_ENDPOINT_RINKEBY_ALCHEMY);

    const handleOpen = async () => {
        if (btnText === DISCONNECT_TEXT) {
            setWeb3(null);
            setBalance(0);
            setAccount("0x");
            setBtnText(CONNECT_TEXT);
            setWooNft(null);

            window.location.href = "/";

        } else {
            setOpen(true);
        }
    }
    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {

        if (!isEmpty(web3)) {

            web3.getSigner(0).getAddress().then(v => setAccount(v));
            web3.getSigner(0).getBalance().then(v => setBalance(parseFloat(ethers.utils.formatEther(v)).toFixed(3)));

            const woo = new ethers.Contract(artifact.contracts.Woo.address,
                artifact.contracts.Woo.abi,
                web3.getSigner());

            setWooNft(woo);
            setOpen(false);
            setBtnText(DISCONNECT_TEXT);
        }

    }, [web3]);


    return (

        <Fragment>
            <Provider value={{ setWeb3, wooNft, defaultProvider }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            My Friends Woo NFT
                        </Typography>
                        <Box sx={{ paddingRight: "20px" }}>
                            <Typography sx={{ fontSize: "medium" }}>
                                {account}
                            </Typography>
                        </Box>
                        <Box sx={{ paddingRight: "20px" }}>
                            <Typography sx={{ fontSize: "medium" }}>
                                Balance ??<b>{balance}</b>
                            </Typography>
                        </Box>
                        <Button color="info" variant="contained" onClick={handleOpen}>{btnText}</Button>
                    </Toolbar>
                </AppBar>


                <Box sx={{ paddingLeft: "20px", paddingTop: "20px" }}>

                    <BrowserRouter>
                        <Routes>
                            <Route path="/">
                                <Route path=":pageNo" element={<WooList />} />
                                <Route path="" element={<WooList />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>

                </Box>
                <WalletModal open={open} close={handleClose} />
            </Provider>
        </Fragment>

    );
}

export default App;


export {
    Context
}

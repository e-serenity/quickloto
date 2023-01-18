import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import "./App.css";
// import idl from "./idl.json";
import kp from "./keypair.json";

// Constants
const TWITTER_HANDLE = "E_Serenity_Dev";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const { SystemProgram } = web3;

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const network = clusterApiUrl("devnet");
// This is the address of your solana program, if you forgot,
// just run `solana address -k target/deploy/myepicproject-keypair.json`
const programID = new PublicKey("Uit4YPvpH41rggra2Ljt5u7jNWSAGQns61vYQhfYFUY");
// const programID = new PublicKey(idl.metadata.address);

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
    preflightCommitment: "processed",
};

const App = () => {
    // State
    const [walletAddress, setWalletAddress] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [betList, setBetList] = useState([]);

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(connection, window.solana, opts.preflightCommitment);
        return provider;
    };

    const getProgram = async () => {
        // Get metadata about your solana program
        const idl = await Program.fetchIdl(programID, getProvider());
        // Create a program that you can call
        return new Program(idl, programID, getProvider());
    };

    // Actions
    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window;

            if (solana) {
                if (solana.isPhantom) {
                    console.log("Phantom wallet found!");
                    const response = await solana.connect({ onlyIfTrusted: true });
                    console.log("Connected with Public Key:", response.publicKey.toString());

                    /*
                     * Set the user's publicKey in state to be used later!
                     */
                    setWalletAddress(response.publicKey.toString());
                }
            } else {
                alert("Solana object not found! Get a Phantom Wallet 👻");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getBetList = async () => {
        try {
            
            const program = await getProgram();
            console.log("programID: ", programID.toString());
            const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
            // const account = await program.provider.connection.getAccountInfo(baseAccount.publicKey)
            console.log("Got the account", account);
            setBetList(account.betList);
        } catch (error) {
            console.log("Error in getBetList: ", error);
            setBetList(null);
        }
    };

    const connectWallet = async () => {
        const { solana } = window;

        if (solana) {
            const response = await solana.connect();
            console.log("Connected with Public Key:", response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
        }
    };

    const sendBet = async () => {
        if (inputValue.length === 0) {
            console.log("No alias given!");
            return;
        }
        setInputValue("");
        console.log("Wallet Alias:", inputValue);
        try {
            const provider = getProvider();
            const program = await getProgram();

            await program.rpc.addBet(inputValue, {
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                },
            });
            console.log("Bet successfully sent to program", inputValue);

            await getBetList();
        } catch (error) {
            console.log("Error sending Bet:", error);
        }
    };

    const onInputChange = (event) => {
        const { value } = event.target;
        setInputValue(value);
    };

    const renderNotConnectedContainer = () => (
        <button className="cta-button connect-wallet-button" onClick={connectWallet}>
            Connect to Wallet
        </button>
    );

    const createBetAccount = async () => {
        try {
            const program = await getProgram();
            const provider = await getProvider();

            console.log("ping");
            await program.rpc.startStuffOff({
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [baseAccount],
            });
            console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString());
            await getBetList();
        } catch (error) {
            console.log("Error creating BaseAccount account:", error);
        }
    };

    const renderConnectedContainer = () => {
        // If we hit this, it means the program account hasn't been initialized.
        if (betList === null) {
            return (
                <div className="connected-container">
                    <button className="cta-button submit-bet-button" onClick={createBetAccount}>
                        Do One-Time Initialization For Bet Program Account
                    </button>
                </div>
            );
        }
        // Otherwise, we're good! Account exists. User can submit Bets.
        else {
            return (
                <div className="connected-container">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            sendBet();
                        }}
                    >
                        <input type="text" placeholder="Enter your wallet Alias!" value={inputValue} onChange={onInputChange} />
                        <button type="submit" className="cta-button submit-bet-button">
                            Submit
                        </button>
                    </form>
                    <div className="bet-grid">
                        {/* We use index as the key instead, also, the src is now item.alias */}
                        {betList.map((item, index) => (
                            <div className="user" key={index}>
                                {item.userAlias}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    };

    // UseEffects
    useEffect(() => {
        const onLoad = async () => {
            await checkIfWalletIsConnected();
        };
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    }, []);

    useEffect(() => {
        if (walletAddress) {
            console.log("Fetching Bets list...");
            getBetList();
        }
    }, [walletAddress]);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header">💰 QuickLoto 💰</p>
                    <p className="sub-text">
                        ✨ Work In Progress - My first solana program - Choose a winner every 10 transactions ✨
                    </p>
                    {!walletAddress && renderNotConnectedContainer()}
                    {/* We just need to add the inverse here! */}
                    {walletAddress && renderConnectedContainer()}
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built by @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;

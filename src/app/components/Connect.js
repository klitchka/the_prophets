"use client"
import React, { useEffect, useState } from 'react'
import styles from "./connect.module.css"
import { disconnect, connect } from "starknetkit"
import { useAccount, useConnect } from "@starknet-react/core"
import { connectors } from "./connectors"


function Connect() {
  const [connection, setConnection] = useState('');
  
  
  const { connect: connectSR } = useConnect()
  const { account, address } = useAccount()

  const connectToStarknet = async () => {
    const starknet = await connect({ modalMode: "alwaysAsk" });

    if (!starknet) {
      return;
    }

    const connector = connectors.find(c => c.id === starknet.id);
    console.log(
      "🚀 ~ file: App.tsx:34 ~ connectToStarknet ~ connector:",
      connector
    );

    if (!connector) {
      return;
    }

    // @ts-expect-error TODO: fix this
    connectSR({ connector });
  };

  const requestFunds = async () => {
    // Aquí es donde puedes lanzar tu transacción para solicitar fondos
  }

  // const connectWallet = async() => {
  //   const connection = await connect( { webWalletUrl: "https://web.argent.xyz" } )

  //   if(connection && connection.isConnected) {
  //       setConnection(connection)
  //       setAccount(connection.account)
  //       setAddress(connection.selectedAddress)
  //   }
  // }

  const disconnectWallet = async() => {
    await disconnect()
    setConnection(undefined)
    setAccount(undefined)
    setAddress('')
  }

  return (
    <div>
        {
          !address ? 
            <button className={styles.connectbtn} onClick={connectToStarknet}>Connect</button>
          : 
            <>
              <button className={styles.connectbtn} onDoubleClick={disconnectWallet}>{address.slice(0, 5)}...{address.slice(60, 66)}</button>
            </>
        }
    </div>
  )
}

export default Connect
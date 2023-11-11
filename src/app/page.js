"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Connect from "./components/Connect";
import OpenLogin from "@toruslabs/openlogin";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import Transfer from "./components/Transfer";
import Balance from "./components/Balance";

function Home() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sdkInstance, setSdk] = useState(null);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setLoading(true);
    const sdk = new OpenLogin({
      clientId: "the_prophets",
      network: "testnet"
    });
    async function initializeOpenlogin() {
      await sdk.init();
      if (sdk.privKey) {
        // Aquí es donde debes poner tu código real
      }
      setSdk(sdk);
      setLoading(false);
    }
    initializeOpenlogin();
  }, []);

  async function handleLogin() {
    if (sdkInstance) {
      if (isConnected) {
        await disconnect();
      } else {
        const privKey = await sdkInstance.login({
          loginProvider: "google",
          redirectUrl: `${window.origin}`,
        });
        return privKey;
      }
    }
  }

  const handleSignMessage = async () => {
    if (sdkInstance) {
      try {
        const signature = await sdkInstance.signMessage("Mensaje a firmar");
        console.log("Firma de mensaje:", signature);
      } catch (error) {
        console.error("Error al firmar mensaje:", error);
      }
    }
  };

  return (
    <main className={styles.main}>
      <button onClick={handleLogin} className={styles.connectbtn}>
        {isConnected ? "Desconectar wallet" : "Sign in with Google"}
      </button>
      <Connect />
      <Transfer sdkInstance={sdkInstance} />
      <Balance sdkInstance={sdkInstance} />

    </main>
  );
}

export default Home;
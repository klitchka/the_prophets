"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import OpenLogin from "@toruslabs/openlogin";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

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
    setLoading(true)
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
      setLoading(false)
    }
    initializeOpenlogin();
  }, []);

  async function handleLogin() {
    if (sdkInstance) {
      const privKey = await sdkInstance.login({
        loginProvider: "google",
        redirectUrl: `${window.origin}`,
      });
      return privKey;
    }
  }

  // ... código restante ...

  return (
    <main className={styles.main}>
      {/* ... código restante ... */}
      <button onClick={handleLogin} className={styles.connectbtn}>
        Iniciar sesión con Google
      </button>
      {/* ... código restante ... */}
    </main>
  );
}

export default Home;
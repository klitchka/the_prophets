"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles/marketplace.module.css";
import OpenLogin from "@toruslabs/openlogin";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import Arsenal from "../../../public/arsenal.png";
import Chelsey from "../../../public/chelsey.png";
import Image from "next/image";

const DATA = [
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
  },
];

function Marketplace() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sdkInstance, setSdk] = useState(null);
  const [currentSelectedTab, setCurrentSelectedTab] = useState("Upcoming");

  const TABS = ["Upcoming", "Live", "Finished"];

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setLoading(true);
    const sdk = new OpenLogin({
      clientId: "the_prophets",
      network: "testnet",
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
      const privKey = await sdkInstance.login({
        loginProvider: "google",
        redirectUrl: `${window.origin}`,
      });
      return privKey;
    }
  }

  // ... código restante ...

  return (
    <div className={styles.container}>
      <div style={{ height: 20 }} />
      <div className={styles.upcoming_match}>
        <div className={styles.match_container}>
          <h3>Arsenal</h3>
        </div>
        <div className={styles.match_container}>
          <h3>Chelsea</h3>
        </div>
      </div>

      <div className={styles.data_container}>
        <div className={styles.tabs_container}>
          {TABS.map((tab, index) => (
            <div
              className={styles.each_tab}
              style={{
                width: "100%",
                borderBottomColor: tab === currentSelectedTab ? "#fff" : null,
              }}
              key={index}
            >
              <div onClick={() => setCurrentSelectedTab(tab)}>
                <h3 style={{ lineHeight: 2 }}>{tab.toLocaleUpperCase()}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.rows_container}>
          {currentSelectedTab === "Upcoming" ? (
            <>
              {DATA.map((data, index) => (
                <div className={styles.each_row} key={index}>
                  <div className={styles.row_match_details}>
                    <div className={styles.team_name}>
                      <Image
                        className={styles.logoSmall}
                        src={Arsenal}
                        alt="Arsenal"
                      />
                      <p>{data.team1}</p>
                    </div>
                    <p>vs</p>
                    <div className={styles.team_name}>
                      <Image
                        className={styles.logoSmall}
                        src={Chelsey}
                        alt="Chelsea"
                      />
                      <p>{data.team2}</p>
                    </div>
                  </div>
                  <div className={styles.row_buttons_container}>
                    <button className={styles.bet_buttons}>
                      <Image
                        className={styles.logoSmall}
                        src={Arsenal}
                        alt="Arsenal"
                      />
                      <p>1.59</p>
                    </button>
                    <button className={styles.bet_buttons}>
                      <p>DRAW</p>
                    </button>
                    <button className={styles.bet_buttons}>
                      <Image
                        className={styles.logoSmall}
                        src={Chelsey}
                        alt="Chelsea"
                      />
                      <p>5.01</p>
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : currentSelectedTab === "Live" ? (
            <h1>live</h1>
          ) : (
            <h1>past</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Marketplace;

"use client";
import styles from "../styles/bets.module.css";
import Image from "next/image";
import Divider from "../components/UI/divider";
import Arsenal from "../../../public/arsenal.png";
import Chelsey from "../../../public/chelsey.png";
import React from "react";

const DATA = [
  {
    team1: "Arsenal",
    team2: "Chelsea",
    betFor: "draw",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
    betFor: "draw",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
    betFor: "draw",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
    betFor: "draw",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
    betFor: "draw",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
    betFor: "draw",
  },
  {
    team1: "Arsenal",
    team2: "Chelsea",
    betFor: "draw",
  },
];

function Bets() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [selectedBet, setSelectedBet] = React.useState(null);

  function openModal(data) {
    setIsOpen(true);
    setSelectedBet(data);
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <div className={styles.container}>
      <div style={{ height: 20 }} />
      <div className={styles.event_details}>
        <div className={styles.row_match_details}>
          <div className={styles.team_name}>
            <Image
              className={styles.logoSmall}
              src={Arsenal}
              alt="Arsenal"
              width={32}
            />
            <p>Arsenal</p>
          </div>
          <p>vs</p>
          <div className={styles.team_name}>
            <Image
              className={styles.logoSmall}
              src={Chelsey}
              alt="Chelsea"
              width={32}
            />
            <p>Chelsea</p>
          </div>
        </div>
      </div>

      <div className={styles.category_layout}>
        <div className={styles.category_container}>
          <div className={styles.category_heading}>Full time Result</div>
          <Divider />
          <div className={styles.category_bets_container}>
            <div className={styles.bet_box} onClick={() => openModal(DATA[0])}>
              <Image
                className={styles.logoSmall}
                src={Arsenal}
                alt="Arsenal"
                width={32}
              />
              <p>1.59</p>
            </div>
            <div className={styles.bet_box} onClick={() => openModal(DATA[1])}>
              <p>Draw</p>
              <p>3.80</p>
            </div>
            <div className={styles.bet_box} onClick={() => openModal(DATA[2])}>
              <Image
                className={styles.logoSmall}
                src={Arsenal}
                alt="Arsenal"
                width={32}
              />
              <p>5.07</p>
            </div>
          </div>
        </div>

        <div className={styles.category_container}>
          <div className={styles.category_heading}>Total Goals</div>
          <Divider />
          <div className={styles.category_bets_container}>
            <div className={styles.bet_box} onClick={() => openModal(DATA[3])}>
              <p>Over (2.5)</p>
              <p>1.85</p>
            </div>
            <div className={styles.bet_box} onClick={() => openModal(DATA[4])}>
              <p>Under (2.5)</p>
              <p>1.90</p>
            </div>
            <div className={styles.bet_box} onClick={() => openModal(DATA[5])}>
              <p>Over (3.5)</p>
              <p>3.10</p>
            </div>
            <div className={styles.bet_box} onClick={() => openModal(DATA[6])}>
              <p>Under (3.5)</p>
              <p>1.29</p>
            </div>
          </div>
        </div>

        {modalIsOpen ? (
          <div
            onClick={closeModal}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.5,
                zIndex: 5,
                backgroundColor: "black",
              }}
            />
            <div
              style={{
                width: 500,
                backgroundColor: "#222328",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                padding: "2rem",
                alignItems: "center",
                zIndex: 10,
                borderRadius: 10,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h1 style={{ textAlign: "center" }}>Enter Bet Amount</h1>
              <input
                style={{
                  width: "80%",
                  padding: "1rem",
                  border: "none",
                  borderRadius: 10,
                  backgroundColor: "#222328",
                  color: "white",
                  border: "1px solid white",
                }}
                type="text"
                placeholder="Amount"
              />
              <div
                style={{
                  backgroundColor: "white",
                  padding: "1rem 2rem",
                  color: "black",
                  borderRadius: 25,
                  cursor: "pointer",
                }}
                onClick={() => console.log("handle submit")}
              >
                Submit
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Bets;

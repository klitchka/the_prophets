"use client";
import styles from "../styles/bets.module.css";
import Image from "next/image";
import Divider from "../components/UI/divider";
import Arsenal from "../../../public/arsenal.png";
import Chelsey from "../../../public/chelsey.png";

function Bets() {
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
            <div className={styles.bet_box}>
              <Image
                className={styles.logoSmall}
                src={Arsenal}
                alt="Arsenal"
                width={32}
              />
              <p>1.59</p>
            </div>
            <div className={styles.bet_box}>
              <p>Draw</p>
              <p>3.80</p>
            </div>
            <div className={styles.bet_box}>
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
            <div className={styles.bet_box}>
              <p>Over (2.5)</p>
              <p>1.85</p>
            </div>
            <div className={styles.bet_box}>
              <p>Under (2.5)</p>
              <p>1.90</p>
            </div>
            <div className={styles.bet_box}>
              <p>Over (3.5)</p>
              <p>3.10</p>
            </div>
            <div className={styles.bet_box}>
              <p>Under (3.5)</p>
              <p>1.29</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bets;

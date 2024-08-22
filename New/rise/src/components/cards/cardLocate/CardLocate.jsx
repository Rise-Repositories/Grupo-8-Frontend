import React from 'react';
import styles from './CardLocate.module.css';



const CardLocate = () => {
  return (
      <div className={styles["location-card"]}>
        <div className={styles["map-preview"]}></div>
        <div className={styles["info"]}>
          <p>R. Eduardo Prado, 28</p>
          <p className={styles["date"]}>18/20/2024</p>
          {/* <button className={styles["actions-button"]}>Ver ações</button> */}
        </div>
      </div>
  );
};

export default CardLocate;
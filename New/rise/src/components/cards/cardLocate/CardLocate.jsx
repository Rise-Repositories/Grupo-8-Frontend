import React from 'react';
import styles from './CardLocate.module.css';

const CardLocate = ({ address, date, onClick }) => {
  return (
      <div className={styles["location-card"]} onClick={onClick}>
        <div 
          className={styles["map-preview"]}
        ></div>
        <div className={styles["info"]}>
          <p>{address}</p>
          <p className={styles["date"]}>{date}</p>
          {/* <button className={styles["actions-button"]}>Ver ações</button> */}
        </div>
      </div>
  );
};

export default CardLocate;

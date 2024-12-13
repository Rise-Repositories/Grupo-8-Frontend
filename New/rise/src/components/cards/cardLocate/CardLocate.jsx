import React from 'react';
import styles from './CardLocate.module.css';

const CardLocate = ({ address, date, onClick }) => {
  return (
      <div className={styles["location-card"]} onClick={onClick}>
        <div className={styles["info"]}>
          <p>{address}</p>
          <p className={styles["date"]}>{date}</p>
        </div>
      </div>
  );
};

export default CardLocate;

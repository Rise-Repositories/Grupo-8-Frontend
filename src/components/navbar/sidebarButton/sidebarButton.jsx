import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './sidebarButton.module.css'

const SidebarButton = ({ sidebarVisible, onClick }) => {
  return (
    <Button variant="link" onClick={onClick} className={styles.button}>
      {!sidebarVisible &&
        <span>☰</span>
      }
      {sidebarVisible &&
        <span>X</span>
      }
    </Button>
  );
};

export default SidebarButton;

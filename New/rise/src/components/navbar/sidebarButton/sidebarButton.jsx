import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './sidebarButton.module.css'

const SidebarButton = ({ toggleSidebar }) => {
  return (
    <Button variant="link" onClick={toggleSidebar} className={styles.button}>
      ☰
    </Button>
  );
};

export default SidebarButton;

import React from 'react';
import Navbar from '@/components/NavBar';
import NewsSplace from './components/NewsSplace';
import PersonSide from './components/PersonSide';

import styles from "./styles/index.module.less";

export default function Material() {

  return (
    <div
    >

      <div className={styles.navbar}><Navbar show={true} /></div>
      <div className={styles.materialContainer}>
        <PersonSide />
        <NewsSplace />
      </div>
    </div>
  );
}

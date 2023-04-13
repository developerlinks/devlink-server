import React from 'react';
import Navbar from '@/components/NavBar';

import styles from './styles/index.module.less';
import UserInfo from '../info';

export default function userInfoPage() {
  return (
    <div className={styles.userInfoPage}>
      <div className={styles.userInfoContainer}>
        <UserInfo />
      </div>
    </div>
  );
}

import React from 'react';
import Navbar from '@/components/NavBar';

import styles from './styles/index.module.less';
import UserSetting from '../setting';

export default function userSettingPage() {
  return (
    <div>
      <div className={styles.navbar}>
        <Navbar show={true} />
      </div>
      <div className={styles.userInfoContainer}>
        <UserSetting />
      </div>
    </div>
  );
}

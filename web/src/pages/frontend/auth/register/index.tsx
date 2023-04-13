import React, { useEffect } from 'react';
import Footer from '@/components/Footer';
import Logo from '@/assets/devlink_black.svg';
import RegisterForm from './form';
import styles from './style/index.module.less';

function Register() {
  useEffect(() => {
    document.body.setAttribute('arco-theme', 'light');
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
          <Logo />
        <div className={styles['logo-text']}>DevLink</div>
      </div>
      <div className={styles.content}>
        <div className={styles['content-inner']}>
          <RegisterForm />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
Register.displayName = 'LoginPage';

export default Register;

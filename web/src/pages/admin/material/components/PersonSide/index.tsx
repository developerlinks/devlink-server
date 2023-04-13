import { Button, Input } from '@arco-design/web-react';
import React from 'react';
import MaterialList from './components/MaterialList/MaterialList';
import styles from './styles/index.module.less';

export default function PersonSide() {
  return (
    <div className={styles.PersonSideContainer}>
      <div className={styles.ownerContainer}>
        <div className={styles.ownerControl}>
          <div className={styles.ownerControlTop}>
            <div>我的仓库</div>
            <Button type="primary">创建</Button>
          </div>
          <div className={styles.ownerControlSearch}>
            <Input allowClear placeholder="搜索自己的仓库" />
          </div>
          <MaterialList />
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Tabs, Typography } from '@arco-design/web-react';
const TabPane = Tabs.TabPane;
const style = {
  textAlign: 'center',
  marginTop: 20,
};
import styles from './styles/index.module.less';
import MaterialCard from './components/MaterialCard';
import MaterialList from './components/MaterialList';

export default function NewsSplace() {
  return (
    <div className={styles.NewsSplaceContainer}>
      <div className={styles.TabContainer}>
        <Tabs defaultActiveTab="recommend">
          <TabPane key="recommend" title="推荐">
            <MaterialList />
          </TabPane>
          <TabPane key="follow" title="关注">
            <Typography.Paragraph style={style}>
              Content of Tab Panel 2
            </Typography.Paragraph>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

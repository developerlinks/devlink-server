import React from 'react';
import Navbar from '@/components/NavBar';

import styles from './styles/index.module.less';
import CodeCopy from '@/pages/frontend/home/components/CodeCopy';
import { Avatar, Tabs, Tag } from '@arco-design/web-react';
import {
  IconBranch,
  IconCalendar,
  IconStar,
} from '@arco-design/web-react/icon';
import MaterialComment from './components/CommentItem';
import CommentInput from './components/CommentInput';
import MaterialDocs from './components/MaterialDocs';

const TabPane = Tabs.TabPane;

export default function MaterialInfo() {
  const info = {
    author: 'bowlingq',
    name: 'devlink-cli',
    time: '1 小时以前',
    description:
      '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
    language: 'typeScript',
  };

  const renderCodeContent = () => {
    return (
      <CodeCopy
        code={'npm install -g <span class="token-package">@devlink/cli</span>'}
        copyText="npm i @devlink/cli"
      />
    );
  };

  return (
    <div className={styles.materialInfoBox}>
      <div className={styles.materialInfoContainer}>
        <div className={styles.materialHeader}>
          <div className={styles.materialInfo}>
            <Avatar size={50}>{info.author}</Avatar>
            <div className={styles.materialData}>
              <div className={styles.materialTitle}>
                <div className={styles.title}>{info.name}</div>
                <div className={styles.tag}>
                  <Tag>组件</Tag>
                </div>
              </div>
              <div className={styles.materialUserData}>
                <div className={styles.collect}>
                  <IconStar style={{ fontSize: 16 }} />
                </div>
                <div className={styles.date}>
                  <IconCalendar style={{ fontSize: 16 }} />
                  2023.3.14
                </div>
                <div className={styles.url}>
                  <IconBranch style={{ fontSize: 16 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultActiveTab="overview" size='large'>
          <TabPane key="overview" title="总览" >
            <MaterialDocs />
          </TabPane>
          <TabPane key="docs" title="讨论">
            <CommentInput />
            <MaterialComment />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

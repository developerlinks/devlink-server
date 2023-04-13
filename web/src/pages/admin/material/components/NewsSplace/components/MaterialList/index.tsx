import React, { useState } from 'react';
import { Card, Avatar, Typography, Space, Modal } from '@arco-design/web-react';
import {
  IconThumbUp,
  IconShareInternal,
  IconMore,
  IconStar,
  IconInfoCircleFill,
} from '@arco-design/web-react/icon';

const { Meta } = Card;
import styles from './styles/index.module.less';
import MaterialInfo from '@/pages/material/MaterialInfo';
import MaterialCard from '../MaterialCard';

export default function MaterialList() {
  const [visible, setVisible] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [info, setInfo] = useState(null);
  const list = [
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
    {
      id: 1,
      author: 'bowlingq',
      name: 'devlink-cli',
      time: '1 小时以前',
      description:
        '将内容组织同一视图中，一次可查看一个视图内容。查看其他内容可切换选项卡查看。',
      language: 'typeScript',
    },
  ];

  return (
    <div className={styles.MaterialCardContainer}>
      {list.map((item) => (
        <div key={item.name} className={styles.materialItem}>
          <div className={styles.materialTitle}>
            <Avatar
              style={{
                backgroundColor: '#168CFF',
              }}
            >
              devLink
            </Avatar>
            <div className={styles.actionText}>
              创建
              <div className={styles.materialName}>
                {item.author}/{item.name}
              </div>
              1小时以前
            </div>
          </div>
          <MaterialCard info={item} />
        </div>
      ))}
      {/* <Modal
        style={{ cursor: 'move', width: '800px', height: 'auto' }}
        visible={visible}
        closable
        autoFocus={false}
        onMouseOver={() => {
          disabled && setDisabled(false);
        }}
        onMouseOut={() => {
          !disabled && setDisabled(true);
        }}
        // modalRender={(modal) => <Draggable disabled={disabled}>{modal}</Draggable>}
      >
        <MaterialInfo info={info} />
      </Modal> */}
    </div>
  );
}

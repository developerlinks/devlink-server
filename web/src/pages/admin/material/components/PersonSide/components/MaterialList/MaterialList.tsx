import { Avatar } from '@arco-design/web-react';
import React from 'react';
import styles from './styles/index.module.less';

export default function MaterialList() {
  const list = [
    {
      image:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/bd15acf1db80469e90992c43dc5fe40c~tplv-uwbnlip3yd-image.image',
      name: 'bowlingq/devlink',
    },
    {
      image:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/bd15acf1db80469e90992c43dc5fe40c~tplv-uwbnlip3yd-image.image',
      name: 'bowlingq/devlink',
    },
    {
      image:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/bd15acf1db80469e90992c43dc5fe40c~tplv-uwbnlip3yd-image.image',
      name: 'bowlingq/devlink',
    },
    {
      image:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/bd15acf1db80469e90992c43dc5fe40c~tplv-uwbnlip3yd-image.image',
      name: 'bowlingq/devlink',
    },
    {
      image:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/bd15acf1db80469e90992c43dc5fe40c~tplv-uwbnlip3yd-image.image',
      name: 'bowlingq/devlink',
    },
  ];
  return (
    <div className={styles.MaterialListContainer}>
      {list.map((item) => (
        <div key={item.name}>
          <div className={styles.materialItem}>
            <Avatar size={24}>Arco</Avatar>
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );
}

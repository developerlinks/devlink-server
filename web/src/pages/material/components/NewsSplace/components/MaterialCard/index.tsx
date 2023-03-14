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

export default function MaterialCard({info}) {
  return (
    <Card
      className="card-with-icon-hover"
      style={{ width: 460, marginTop: '10px' }}
      onClick={() => {
        // setInfo(item);
        // setVisible(true);
        window.open('/materialinfo');
        // window.location.href='/materialinfo'
      }}
      bordered
      hoverable
      actions={[
        <span className="icon-hover">
          <IconThumbUp />
        </span>,
        <span className="icon-hover">
          <IconStar />
        </span>,
        <span className="icon-hover">
          <IconMore />
        </span>,
      ]}
    >
      <Meta
        avatar={
          <Space>
            <Typography.Text>{info.language}</Typography.Text>
          </Space>
        }
        title={`${info.author} / ${info.name}`}
        description={info.description}
      />
    </Card>
  );
}

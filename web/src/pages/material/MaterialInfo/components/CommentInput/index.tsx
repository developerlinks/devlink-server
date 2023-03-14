import React from 'react';
import { Comment, Avatar, Button, Input } from '@arco-design/web-react';
import {
  IconHeartFill,
  IconMessage,
  IconStarFill,
  IconHeart,
  IconStar,
} from '@arco-design/web-react/icon';

export default function CommentInput() {
  return (
    <Comment
      style={{ marginTop: '10px' }}
      align="right"
      actions={[
        // <Button key='0' type='secondary'>
        //   取消
        // </Button>,
        <Button key="1" type="primary">
          发送
        </Button>,
      ]}
      avatar="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp"
      content={
        <div>
          <Input.TextArea placeholder="请输入" />
        </div>
      }
    ></Comment>
  );
}

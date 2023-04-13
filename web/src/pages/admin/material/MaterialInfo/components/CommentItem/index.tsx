import React from 'react';
import { Comment, Avatar, Button } from '@arco-design/web-react';
import {
  IconHeartFill,
  IconMessage,
  IconStarFill,
  IconHeart,
  IconStar,
} from '@arco-design/web-react/icon';

export default function MaterialComment() {
  const [like, setLike] = React.useState(true);
  const [star, setStar] = React.useState(true);
  const actions = [
    <Button type="text" key="heart" onClick={() => setLike(!like)}>
      {like ? <IconHeartFill style={{ color: '#f53f3f' }} /> : <IconHeart />}
      {83 + (like ? 1 : 0)}
    </Button>,
    <Button type="text" key="star" onClick={() => setStar(!star)}>
      {star ? <IconStarFill style={{ color: '#ffb400' }} /> : <IconStar />}
      {3 + (star ? 1 : 0)}
    </Button>,
    <Button type="text" key="reply">
      <IconMessage /> 回复
    </Button>,
  ];
  return (
    <Comment
      actions={actions}
      align="right"
      author="Balzac"
      avatar={
        <Avatar>
          <img
            alt="avatar"
            src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/9eeb1800d9b78349b24682c3518ac4a3.png~tplv-uwbnlip3yd-webp.webp"
          />
        </Avatar>
      }
      content={
        <div>
          一个基本的评论组件，带有作者、头像、时间和操作。
        </div>
      }
      datetime="1 hour"
    />
  );
}

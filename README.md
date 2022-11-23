# amo

# 功能设计

## 用户管理

### 用户角色

```json

type User {
  name,
  eamil,
  role,// root、管理员、普通用户
  avatar,
  status // 正常、禁言
}

type blog {
  blog_id,
  npm_url,
  username,
  title,
  body,
  type,// 分类
  creat_time:
  update_time,
  background_img,
  isTop,
}

type comment {
  blog_id,

  comment_id,
  user_name,
  user_avatar,
  comment_time,
  comment_body,

  reply_user_id,
  reply_user_name,
  reply_user_avatar,
  reply_time,
  reply_body,

}

```

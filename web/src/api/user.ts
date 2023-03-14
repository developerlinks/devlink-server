import http from './http';

type Login = {
  username: 'string';
  password: 'string';
};
// TODO response type

export const loginApi = (data: Login) =>
  http({
    url: '/auth/signin',
    method: 'post',
    data,
  });

export const register = (data: Login) =>
  http({
    url: '/auth/signup',
    method: 'post',
    data,
  });

export const findAllUser = () => http('/user/findall');

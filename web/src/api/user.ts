import http from './http';

type LoginByPassword = {
  email: 'string';
  password: 'string';
};

type RegisterByEmail = {
  email: 'string';
  password: 'string';
  code: 'string';
  username: 'string';
};

// TODO response type

export const loginApi = (data: LoginByPassword) =>
  http({
    url: '/auth/signin_by_password',
    method: 'post',
    data,
  });

export const register = (data: RegisterByEmail) =>
  http({
    url: '/auth/signup',
    method: 'post',
    data,
  });

export const findAllUser = () => http('/user/findall');

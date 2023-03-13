import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '../../user/user.entity';
import { ForbiddenException } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService（登录认证模块-服务）', () => {
  let service: AuthService;
  let userService: Partial<UserService>;
  let jwt: Partial<JwtService>;
  let userArr: User[];
  const mockUser = {
    username: 'toimc_brian',
    password: '123456',
  };

  beforeEach(async () => {
    userArr = [];
    userService = {
      find: (username: string) => {
        const user = userArr.find((user) => user.username === username);
        return Promise.resolve(user);
      },
      create: async (user: Partial<User>) => {
        const tmpUser = new User();
        tmpUser.id = Math.floor(Math.random() * 1000);
        tmpUser.username = user.username;
        tmpUser.password = await argon2.hash(user.password);
        userArr.push(tmpUser);
        return Promise.resolve(tmpUser);
      },
    };

    jwt = {
      signAsync: (
        payload: string | object | Buffer,
        options?: JwtSignOptions,
      ) => {
        return Promise.resolve('token');
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwt,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    userArr = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('用户初次注册', async () => {
    const user = await service.signup(mockUser.username, mockUser.password);

    expect(user).toBeDefined();
    expect(user.username).toBe(mockUser.username);
  });

  it('用户使用相同的用户名再次注册', async () => {
    await service.signup(mockUser.username, mockUser.password);

    await expect(
      service.signup(mockUser.username, mockUser.password),
    ).rejects.toThrowError();

    await expect(
      service.signup(mockUser.username, mockUser.password),
    ).rejects.toThrow(new ForbiddenException('用户已存在'));
  });

  it('用户登录', async () => {
    // 注册新用户
    await service.signup(mockUser.username, mockUser.password);

    // 登录
    expect(await service.signin(mockUser.username, mockUser.password)).toBe(
      'token',
    );
  });

  it('用户登录，用户名密码错误', async () => {
    // 注册新用户
    await service.signup(mockUser.username, mockUser.password);
    await expect(
      service.signin(mockUser.username, '1111111'),
    ).rejects.toThrowError();

    await expect(service.signin(mockUser.username, '1111111')).rejects.toThrow(
      new ForbiddenException('用户名或者密码错误'),
    );
  });

  it('用户登录，用户名不存在', async () => {
    // await service.signup(mockUser.username, mockUser.password);
    await expect(
      service.signin(mockUser.username, mockUser.password),
    ).rejects.toThrowError();

    await expect(
      service.signin(mockUser.username, mockUser.password),
    ).rejects.toThrow(new ForbiddenException('用户不存在，请注册'));
  });
});

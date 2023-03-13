import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';
import { Roles } from '../../roles/roles.entity';
import { SigninUserDto } from '../dto/signin-user.dto';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('AuthController（登录认证模块-控制器）', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // 模拟的AuthService -> 与后续的依赖项UserService等无关联的依赖项
    mockAuthService = {
      signin: (username: string, password: string) => {
        return Promise.resolve('token');
      },
      signup: (username: string, password: string) => {
        const user = new User();
        user.username = username;
        // user.password = password;
        user.roles = [{ id: 1, name: '普通用户' }] as Roles[];
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Redis集成
        // todo 这里不是完美的解决方案，可以使用一个测试的redis进行集成
        RedisModule.forRoot({
          config: {
            url: 'redis://localhost:6379',
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      // providers: [AuthService]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('鉴权-初始化-实例化', () => {
    expect(controller).toBeDefined();
  });

  it('鉴权-控制器-signin注册', async () => {
    const res = controller.signin({
      username: 'test',
      password: '123456',
    } as SigninUserDto);
    expect(await res).not.toBeNull();
    expect((await res).access_token).toBe('token');
  });

  it('鉴权-控制器-signup注册', async () => {
    const res = controller.signup({
      username: 'test',
      password: '123456',
    } as SigninUserDto);
    expect(await res).not.toBeNull();
    expect((await res).id).not.toBeNull();
    expect((await res).password).toBeUndefined();
    expect((await res) instanceof User).toBeTruthy();

    expect((await res).username).toBe('test');
    expect((await res).roles.length).toBeGreaterThan(0);
  });
});

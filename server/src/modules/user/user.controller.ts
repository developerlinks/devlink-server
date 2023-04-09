import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  LoggerService,
  Inject,
  Query,
  ParseIntPipe,
  Req,
  UnauthorizedException,
  UseGuards,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../entity/user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { JwtGuard } from 'src/guards/jwt.guard';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { CreateGroupPipe } from '../group/pipe/create-group.pipe';

@ApiTags('用户')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @ApiOperation({ summary: '获取用户资料' })
  @ApiResponse({ status: 200, description: '成功获取用户资料' })
  @Get('profile')
  getUserProfile(@Query('id', ParseIntPipe) id: string) {
    return this.userService.findProfile(id);
  }

  @ApiOperation({ summary: '查询自己的信息' })
  @Get('userinfo')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getUserInfo(@Req() req) {
    return this.userService.findProfile(req.user.userId);
  }

  @ApiOperation({ summary: '添加用户（后台用）' })
  @Post('adduser')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  addUser(@Body(CreateUserPipe) dto: CreateUserDto, @Req() req) {
    // 判断权限
    const user = dto as User;
    return this.userService.create(user);
  }

  @ApiOperation({ summary: '查询所有用户' })
  @Get('findall')
  getUsers(@Query() query: getUserDto) {
    console.log(query);
    return this.userService.findAll(query);
  }

  @ApiOperation({ summary: '更新自己的信息' })
  @Patch('/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
    @Req() req,
  ): Promise<User> {
    if (id !== req.user.userId) {
      throw new UnauthorizedException();
    }

    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  removeUser(@Param('id') id: string, @Req() req) {
    //TODO: 判断是否是管理员
    return this.userService.remove(id);
  }
}

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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { CreateUserPipe } from './pipes/create-user.pipe';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get('/profile')
  getUserProfile(@Query('id', ParseIntPipe) id: number) {
    return this.userService.findProfile(id);
  }

  @Post('adduser')
  addUser(@Body(CreateUserPipe) dto: CreateUserDto) {
    const user = dto as User;
    return this.userService.create(user);
  }

  @Get('findall')
  getUsers(@Query() query: getUserDto) {
    return this.userService.findAll(query);
  }

  @Get('/getuser/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch('update/:id')
  updateUser(@Body() dto: UpdateUserDto, @Param('id', ParseIntPipe) id: number, @Req() req) {
    // if (id === parseInt(req.user?.userId)) {
    const user = dto as User;
    return this.userService.update(id, user);
    // } else {
    //   throw new UnauthorizedException();
    // }
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number) {
    // 权限：判断用户是否有更新user的权限
    console.info('remove', id);
    return this.userService.remove(id);
  }

  @Get('/logsbygroup/:id')
  findLogById(@Param('id') id: number) {
    return this.userService.findLogByGroup(id);
  }

  @Get('/logs/:id')
  getUserLogs(@Param('id') id: number) {
    return this.userService.findUserLogs(id);
  }
}

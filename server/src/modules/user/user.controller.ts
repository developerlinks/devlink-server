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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { JwtGuard } from 'src/guards/jwt.guard';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { CreateGroupPipe } from '../group/pipe/create-group.pipe';

@ApiTags('用户')
@UseFilters(new TypeormFilter())
@Controller('user')
// @UseGuards(JwtGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get('/profile')
  getUserProfile(@Query('id', ParseIntPipe) id: string) {
    return this.userService.findProfile(id);
  }

  @Post('/adduser')
  addUser(@Body(CreateUserPipe) dto: CreateUserDto) {
    const user = dto as User;
    return this.userService.create(user);
  }

  @Get('findall')
  getUsers(@Query() query: getUserDto) {
    return this.userService.findAll(query);
  }

  @Get('/getuser/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('/:id')
  updateUser(@Body() dto: any, @Param('id') id: string, @Req() req): any {
    // if (id === parseInt(req.user?.userId)) {
    const user = dto as User;
    return this.userService.update(id, user);
    // } else {
    //   throw new UnauthorizedException();
    // }
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    // 权限：判断用户是否有更新user的权限
    console.info('remove', id);
    return this.userService.remove(id);
  }

  @Get('/logsbygroup/:id')
  findLogById(@Param('id') id: number) {
    return this.userService.findLogByGroup(id);
  }

  @Get('/logs/:id')
  getUserLogs(@Param('id') id: string) {
    return this.userService.findUserLogs(id);
  }

  @Get('/group')
  getUserGroup(@Body('user') user) {
    console.info('user', user);
    return this.userService.findUserGroup();
  }

  @Post('/group')
  addGroup(@Body(CreateGroupPipe) dto: CreateGroupDto) {
    console.info('dto', dto);
    return this.userService.addGroup(dto);
  }
}

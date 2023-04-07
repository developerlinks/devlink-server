import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { Logs } from '../../entity/logs.entity';
import { Action } from 'src/enum/action.enum';

class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;

  @IsString()
  name: string;
}

class PublicLogsDto {
  @Expose()
  msg: string;

  @Expose()
  name: string;
}

@Controller('logs')
// UserInterceptor(new SerializationInterceptor(DTO))
export class LogsController {
  @Get()
  getTest() {
    return 'test';
  }

  @Post()
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log('🚀 ~ file: logs.controller.ts ~ line 15 ~ LogsController ~ postTest ~ dto', dto);
    return dto;
  }
}

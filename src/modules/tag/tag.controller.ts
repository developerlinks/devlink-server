import { TagService } from './tag.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagDto } from './dto/get-tag.dto';

@ApiTags('标签')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '添加标签' })
  @Post('')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  addGroup(@Body() dto: CreateTagDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException();
    }
    return this.tagService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '查询所有的标签' })
  search(@Query() query: GetTagDto) {
    return this.tagService.findAll(query);
  }
}

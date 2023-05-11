import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseFilters,
  Req,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { TokenExpiredMessage } from 'src/constant';

@ApiTags('like')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: '点赞物料' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post('/:materialId')
  async likeMaterial(@Param('materialId') materialId: string, @Req() req) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return await this.likeService.likeMaterial(userId, materialId);
  }

  @ApiOperation({ summary: '取消点赞物料' })
  @Delete('/:materialId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async unlikeMaterial(@Param('materialId') materialId: string, @Req() req) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return await this.likeService.unlikeMaterial(userId, materialId);
  }

  @ApiOperation({ summary: '查询物料的点赞' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('/material/:materialId')
  async getLikesOfMaterial(@Param('materialId') materialId: string) {
    return await this.likeService.getLikesOfMaterial(materialId);
  }

  @ApiOperation({ summary: '查询用户点赞的物料列表' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('/user/:userId')
  async getLikesOfUser(@Param('userId') userId: string) {
    return await this.likeService.getLikesOfUser(userId);
  }
}

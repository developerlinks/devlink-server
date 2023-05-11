import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredMessage } from 'src/constant';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';

@ApiTags('评论')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @ApiOperation({ summary: '添加评论' })
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  createComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.commentService.createComment(userId, createCommentDto);
  }

  @ApiOperation({ summary: '获取物料的评论列表' })
  @Get('/:materialId')
  getComments(@Param('materialId') materialId: string) {
    return this.commentService.getComments(materialId);
  }

  @ApiOperation({ summary: '修改评论' })
  @Put('/:commentId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  updateComment(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.commentService.updateComment(userId, commentId, content);
  }

  @ApiOperation({ summary: '删除评论' })
  @Delete('/:commentId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  deleteComment(@Param('commentId') commentId: string, @Req() req) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.commentService.deleteComment(userId, commentId);
  }
}

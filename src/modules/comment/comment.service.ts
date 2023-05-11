import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entity/comment.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { Material } from 'src/entity/material.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createComment(userId: string, createCommentDto: CreateCommentDto) {
    const { content, emoticon, materialId, parentId } = createCommentDto;

    const material = materialId
      ? await this.materialRepository.findOne({ where: { id: materialId } })
      : null;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    const parent = parentId
      ? await this.commentsRepository.findOne({ where: { id: parentId }, relations: ['children'] })
      : null;

    const comment = new Comment({
      content,
      emoticon,
      material,
      user,
      parent,
    });

    const commentTmp = await this.commentsRepository.save(comment);
    return {
      data: commentTmp,
    };
  }

  async getComments(materialId: string) {
    const comments = await this.commentsRepository.find({
      where: { material: { id: materialId } },
      relations: {
        user: { profile: true },
        parent: {
          user: { profile: true },
        },
        children: {
          user: { profile: true },
          parent: true,
        },
      },
      order: {
        updateAt: 'DESC',
        children: {
          updateAt: 'DESC',
        },
      },
    });
    return {
      data: comments,
    };
  }

  async updateComment(userId: string, commentId: string, content: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId, user: { id: userId } },
      relations: {
        user: { profile: true },
        parent: true,
        children: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('未找到评论或不是所有者');
    }

    comment.content = content;
    comment.updateAt = new Date();

    const commentTmp = await this.commentsRepository.save(comment);

    return {
      data: commentTmp,
    };
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId, user: { id: userId } },
    });

    if (!comment) {
      throw new NotFoundException('未找到评论或不是所有者');
    }

    await this.commentsRepository.delete(commentId);

    return {
      data: comment,
    };
  }
}

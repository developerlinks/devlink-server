import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entity/like.entity';
import { Material } from 'src/entity/material.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  async likeMaterial(userId: string, materialId: string): Promise<Like> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const material = await this.materialRepository.findOne({
      where: {
        id: materialId,
      },
    });

    if (!user || !material) {
      throw new Error('User or Material not found');
    }

    const like = this.likeRepository.create({ user, material });

    return this.likeRepository.save(like);
  }

  async unlikeMaterial(userId: string, materialId: string) {
    const material = await this.materialRepository.findOne({ where: { id: materialId } });

    if (!material) {
      throw new NotFoundException('物料不存在');
    }

    const like = await this.likeRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        material: {
          id: materialId,
        },
      },
    });

    if (!like) {
      throw new NotFoundException('未点赞');
    }

    await this.likeRepository.remove(like);

    return {
      data: material,
    };
  }

  async getLikesOfMaterial(materialId: string) {
    const likes = await this.likeRepository.find({
      where: {
        material: {
          id: materialId,
        },
      },
      relations: ['user'],
    });
    return {
      data: likes,
    };
  }

  async getLikesOfUser(userId: string) {
    const likes = await this.materialRepository.find({
      where: {
        likes: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        user: true,
        tags: true,
        collectedInGroups: true,
      },
    });
    return {
      materials: likes,
    };
  }

  async getMaterialLikes(userId: string) {
    const materials = await this.materialRepository.find({
      where: {
        likes: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        likes: {
          user: true,
        },
      },
    });

    return { data: materials };
  }
}

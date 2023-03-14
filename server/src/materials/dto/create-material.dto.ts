import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMaterialDto {
  name: string;

  npmName: string;

  version: string;

  installCommand: string;

  tag: string;

  ignore: string;

  ownerId: string;

  isPrivate: boolean;
}

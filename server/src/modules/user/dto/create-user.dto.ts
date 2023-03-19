import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Roles } from 'src/modules/roles/roles.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  password: string;

  roles?: Roles[] | number[];
}

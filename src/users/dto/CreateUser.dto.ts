import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from './user-role';

export class CreateUserDto {
  @Expose()
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @ApiProperty({ description: 'Email do usuário' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Telefone do usuário' })
  @IsString()
  @IsOptional()
  phone?: string;

  @Expose()
  @ApiProperty({ description: 'Senha do usuário', minLength: 8, maxLength: 18 })
  @IsString()
  @IsNotEmpty()
  @Length(8, 18)
  password: string;

  @Expose()
  @ApiProperty({ description: 'Papel do usuário', enum: UserRole })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @Expose()
  @ApiPropertyOptional({ description: 'Avatar do usuário' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Status do usuario' })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

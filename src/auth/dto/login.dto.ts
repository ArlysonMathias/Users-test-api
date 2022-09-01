import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email do usuário que está tentando logar',
    example: 'usuario@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Senha do usuário que está tentando logar',
    example: '@1234ABCD',
  })
  password: string;
}

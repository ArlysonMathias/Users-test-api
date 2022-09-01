import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { handleError } from 'src/utils/handle.error';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private userSelect = {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  };
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = bcrypt.hashSync(dto.password, 8);

    const data: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    try {
      return await this.prisma.user.create({ data, select: this.userSelect });
    } catch (error) {
      return handleError(error);
    }
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: {
        ...this.userSelect,
      },
    });
  }

  // verificar se existe o id solicitado
  async verifyIdAndReturnUser(id: string): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: { id },
      select: { ...this.userSelect },
    });
    if (!user) {
      throw new NotFoundException(`Entrada do Id '${id}' não encontrado.`);
    }

    return user;
  }

  //

  async findOne(id: string): Promise<User> {
    return this.verifyIdAndReturnUser(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.verifyIdAndReturnUser(id);

    const hashedPassword = bcrypt.hashSync(dto.password, 8);

    const data: UpdateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: this.userSelect,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    await this.verifyIdAndReturnUser(id);

    return this.prisma.user.delete({
      where: { id },
      select: this.userSelect,
    });
  }
}

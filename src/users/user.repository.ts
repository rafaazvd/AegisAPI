import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(user: CreateUserDto) {
    const userResult = await this.prisma.user.create({
      data: user,
    });
    return userResult;
  }

  async findOneByEmail(email: string): Promise<Partial<User> | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });
  }
  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<CreateUserDto>): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
  async deleteByEmail(email: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { email },
    });
  }
}

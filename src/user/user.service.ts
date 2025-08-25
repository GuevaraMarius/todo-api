import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async updateProfile(userId: number, updateProfileDto: any): Promise<User> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateProfileDto.password) {
      updateProfileDto.password = bcrypt.hashSync(
        updateProfileDto.password,
        10,
      );
    }

    await user.update(updateProfileDto);
    return user;
  }

  async findById(userId: number): Promise<User | null> {
    return this.userModel.findByPk(userId);
  }
}

import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && bcrypt.compareSync(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      statusCode: 200,
      status: 'success',
      message: 'Logged in succesfully',
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: any) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Account already exists');
    }

    const hashedPassword = bcrypt.hashSync(userDto.password, 10);
    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    const savedUser = (await this.userRepository.save(
      newUser,
    )) as unknown as User;

    return savedUser;
  }

  async logout(): Promise<void> {}
}

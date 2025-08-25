import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      console.log('Validating user:', email);
      const user = await this.userModel.findOne({ where: { email } });
      if (user && bcrypt.compareSync(pass, user.password)) {
        const userObj = user.get({ plain: true });
        delete userObj.password;
        return userObj;
      }
      return null;
    } catch (error) {
      console.error('validateUser error:', error);
      throw error;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    console.log('JWT payload:', payload);
    const token = this.jwtService.sign(payload);
    console.log('JWT token:', token);
    return {
      statusCode: 200,
      status: 'success',
      message: 'Logged in successfully',
      access_token: token,
    };
  }

  async register(userDto: any) {
    const existingUser = await this.userModel.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Account already exists');
    }

    const hashedPassword = bcrypt.hashSync(userDto.password, 10);

    const newUser = await this.userModel.create({
      ...userDto,
      password: hashedPassword,
    });

    return newUser;
  }

  async logout(): Promise<void> {
    // With JWT, logout is usually handled client-side
    return;
  }
}

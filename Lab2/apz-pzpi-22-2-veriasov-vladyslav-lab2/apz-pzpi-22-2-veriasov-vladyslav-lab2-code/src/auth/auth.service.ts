import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEntity } from './auth.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import 'dotenv/config';
import { LoginDto } from './dtos/login.dto';
import { UserDto } from 'src/user/dtos/user.dto';

@Injectable()
export class AuthService {
  authService: any;
  //   constructor(
  //     private userService: UserService,
  //     private jwtService: JwtService
  //   ) {}
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  //     async signIn(email: string, pass: string): Promise<AuthEntity> {
  //         const user = await  this.prisma.user.findUnique({ where: { email: email } });

  //         console.log("USER", user)

  //         if (!user) {
  //             throw new NotFoundException(`No user found for email: ${email}`);
  //         }

  //         // if (!(await this.validatePassword(pass, user.password))) {
  //         //     throw new UnauthorizedException('Invalid password');
  //         // }

  //         const payload = { email: user.email, role: user.role };
  //         const options = { expiresIn: '1h', privateKey: process.env.JWTSECRET };
  //         return {
  //             accessToken: this.jwtService.sign(payload, options),
  //         };
  //     }

  //     async validatePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
  //         return await bcrypt.compare(inputPassword, storedPassword);
  //     }
  // }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, options: { expiresIn: string; privateKey: string; }) {
    const userData = await this.prisma.user.findUnique({
      where: { email: user.email }
    });
    const payload = { email: user.email, sub: user.id, role: userData.role };
    return {
      access_token: this.jwtService.sign(payload, options),
      email: user.email,
    };
  }

  async register(registerData: UserDto): Promise<any> {//registerData: RegisterDto) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    console.log("SALT", salt)
    console.log("PASSWORD", registerData.password)
    const hashedPassword = await bcrypt.hash(registerData.password, salt);
    console.log("heshed", hashedPassword)
    const user = await this.prisma.user.create({
      data: {
        email: registerData.email,
        password: hashedPassword,
        role: registerData.role,
        name: registerData.name,
        phoneNumber: registerData.phoneNumber,
        bonusAccount: registerData.bonusAccount,
        notification: registerData.notification,
        photo: registerData.photo,
      },
    });

    const { password, ...result } = user;

    const options = { expiresIn: '1h', privateKey: process.env.JWTSECRET };
    let auth = await this.login(result, options);
    return auth;

    // return result;
  }
}
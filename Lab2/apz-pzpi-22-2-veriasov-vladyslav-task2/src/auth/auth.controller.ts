import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { UserDto } from 'src/user/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() req: LoginDto) {
    const options = { expiresIn: '1h', privateKey: process.env.JWTSECRET };
    
    return this.authService.login(req, options);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() req: UserDto) {//RegisterDto) {
    return this.authService.register(req);
  }
}

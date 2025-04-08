import { Body, Controller, Post, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
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

  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // async login(@Body() req: LoginDto, @Res() res: Response) {
  //   const options = { expiresIn: '1h', privateKey: process.env.JWTSECRET };
  //   const token = this.authService.login(req, options);

  //   res.cookie('jwt', token, {
  //     httpOnly: true, // Запрещает доступ к куке из JS
  //     secure: true,  // Только через HTTPS (если фронт и сервер на HTTPS)
  //     sameSite: 'strict', // Защита от CSRF
  //     maxAge: 3600000, // 1 час
  //   });
  //   return this.authService.login(req, options);
  // }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() req: UserDto) {//RegisterDto) {
    return this.authService.register(req);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt'); // Удаляем JWT из кук
    return res.send({ message: 'Logged out' });
  }
}
//  @Res() res: any
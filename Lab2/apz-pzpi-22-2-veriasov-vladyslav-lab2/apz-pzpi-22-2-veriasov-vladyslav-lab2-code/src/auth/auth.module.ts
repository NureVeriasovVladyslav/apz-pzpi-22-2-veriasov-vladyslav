import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import 'dotenv/config';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  // imports: [UserModule],
  imports: [
    // UserService,

    forwardRef(() => UserModule), // Використовуємо forwardRef для уникнення кругового імпорту
    PassportModule,
    JwtModule.register({
      secret:  process.env.JWTSECRET , //  секретний ключ
      signOptions: { expiresIn: '1h' }, // Термін дії токена
    }),
  ],
  controllers: [AuthController],
  // providers: [AuthService, PrismaService, JwtStrategy, JwtService, UserService],
  providers: [ JwtService, AuthService, PrismaService, JwtStrategy],
  exports: [AuthService, JwtService],
})
export class AuthModule {}

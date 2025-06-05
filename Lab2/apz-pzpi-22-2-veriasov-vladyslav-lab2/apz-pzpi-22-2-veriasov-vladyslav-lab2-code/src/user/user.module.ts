import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [], //forwardRef(() => AuthModule)
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService, JwtService, JwtAuthGuard],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { StatController } from './stat.controller';
import { StatService } from './stat.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [StatController],
  providers: [StatService, PrismaService]
})
export class StatModule {}

import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemsRepository } from './items.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, ItemsRepository, PrismaService],
})
export class ItemsModule {}

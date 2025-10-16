import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Item, ItemCategory, Prisma } from '@prisma/client';
import { paginate } from 'src/common/pagination/pagination.util';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';

@Injectable()
export class ItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createItem(data: Prisma.ItemCreateInput): Promise<Item> {
    return this.prisma.item.create({ data });
  }

  findById(id: number): Promise<Item | null> {
    return this.prisma.item.findUnique({ where: { id } });
  }

  async toggleIsBought(id: number): Promise<Item> {
    const item = await this.findById(id);
    if (!item) throw new Error('Item não encontrado');

    return this.prisma.item.update({
      where: { id },
      data: { isBought: !item.isBought },
    });
  }

  findAllByUser(
    page: number = 1,
    page_size: number = 10,
    userId: number,
  ): Promise<PaginatedResponseDto<Item>> {
    return paginate(this.prisma.item, {
      where: { userId },
      orderBy: { createdAt: 'desc' },
      page,
      page_size,
      include: { category: true },
    });
  }

  async findAllCategories(): Promise<ItemCategory[]> {
    return this.prisma.itemCategory.findMany();
  }

  deleteById(id: number): Promise<Item> {
    return this.prisma.item.delete({ where: { id } });
  }
}

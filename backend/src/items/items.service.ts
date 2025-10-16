import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ItemsRepository } from './items.repository';
import { CreateItemDto } from './dto/create-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedResponseDto } from 'src/common/pagination/pagination-response.dto';
import { Item, ItemCategory } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(
    private readonly itemsRepo: ItemsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createItem(dto: CreateItemDto, currentUserId: number) {
    const [user, category] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: currentUserId } }),
      this.prisma.itemCategory.findUnique({ where: { id: dto.categoryId } }),
    ]);

    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (!category) throw new NotFoundException('Categoria não encontrada');

    const item = await this.itemsRepo.createItem({
      name: dto.name,
      quantity: dto.quantity,
      quantityType: dto.quantityType,
      user: { connect: { id: currentUserId } },
      category: { connect: { id: dto.categoryId } },
    });

    return item;
  }

  async toggleIsBought(id: number, currentUserId: number) {
    const item = await this.itemsRepo.findById(id);
    if (!item) throw new NotFoundException('Item não encontrado');

    if (item.userId !== currentUserId) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar este item',
      );
    }

    try {
      return await this.itemsRepo.toggleIsBought(id);
    } catch {
      throw new NotFoundException('Item não encontrado');
    }
  }

  async listItems(
    page: number = 1,
    page_size: number = 10,
    currentUserId: number,
  ): Promise<PaginatedResponseDto<Item>> {
    return this.itemsRepo.findAllByUser(page, page_size, currentUserId);
  }

  async listCategories(): Promise<ItemCategory[]> {
    return this.itemsRepo.findAllCategories();
  }

  async deleteItem(id: number, currentUserId: number) {
    const item = await this.itemsRepo.findById(id);
    if (!item) throw new NotFoundException('Item não encontrado');

    if (item.userId !== currentUserId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este item',
      );
    }

    return this.itemsRepo.deleteById(id);
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  DefaultValuePipe,
  Req,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os itens do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Itens retornados com sucesso' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'page_size', required: false, type: Number, example: 10 })
  async findAll(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('page_size', new DefaultValuePipe(10), ParseIntPipe) page_size = 10,
  ) {
    const items = await this.itemsService.listItems(
      page,
      page_size,
      req.user.userId,
    );

    const transformedResults = items.results.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
    }));

    return {
      ...items,
      results: transformedResults,
    };
  }

  @Get('categories')
  @ApiOperation({ summary: 'Listar todas as categorias de itens' })
  @ApiResponse({
    status: 200,
    description: 'Categorias retornadas com sucesso',
  })
  async findAllCategories() {
    return this.itemsService.listCategories();
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo item' })
  @ApiResponse({ status: 201, description: 'Item criado com sucesso' })
  async create(@Body() dto: CreateItemDto, @Req() req) {
    return this.itemsService.createItem(dto, req.user.userId);
  }

  @Patch(':id/toggle')
  @ApiOperation({
    summary: 'Alternar status de comprado de um item (apenas dono do item)',
  })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  async toggleIsBought(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.itemsService.toggleIsBought(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um item (apenas dono)' })
  @ApiResponse({ status: 200, description: 'Item deletado com sucesso' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.itemsService.deleteItem(id, req.user.userId);
  }
}

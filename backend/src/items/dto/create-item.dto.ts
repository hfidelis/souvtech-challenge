import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsInt } from 'class-validator';
import { EnumQuantityType } from '@prisma/client';

export class CreateItemDto {
  @ApiProperty({ example: 'Arroz 5kg' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2.5 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ enum: EnumQuantityType, example: EnumQuantityType.KILOGRAM })
  @IsEnum(EnumQuantityType)
  quantityType: EnumQuantityType;

  @ApiProperty({ example: 1, description: 'ID da categoria' })
  @IsInt()
  categoryId: number;
}

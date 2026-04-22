import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, IsUrl, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StripeCheckoutItemDto {
  @ApiProperty({ example: 'Concentrado Premium 10kg' })
  @IsString()
  name: string;

  @ApiProperty({ example: 95000, description: 'Precio unitario en la moneda seleccionada' })
  @IsInt()
  @Min(1)
  price: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateStripeCheckoutDto {
  @ApiProperty({ type: [StripeCheckoutItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StripeCheckoutItemDto)
  items: StripeCheckoutItemDto[];

  @ApiPropertyOptional({ example: 'cop', description: 'Código ISO de moneda' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'http://localhost:4200/tienda?payment=success' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  successUrl?: string;

  @ApiPropertyOptional({ example: 'http://localhost:4200/tienda?payment=cancel' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  cancelUrl?: string;
}


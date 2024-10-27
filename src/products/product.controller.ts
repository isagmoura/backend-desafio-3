import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ProductsOrderBy, ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findMany(
    @Query('limit') limit = 16,
    @Query('offset') offset = 0,
    @Query('categories') categories: string,
    @Query('hasDiscount') hasDiscount: boolean,
    @Query('orderBy') orderBy: ProductsOrderBy,
  ): Promise<{
    items: Product[];
    meta: { total: number };
  }> {
    return this.productService.findAll({
      limit,
      offset,
      categories: categories?.split(','),
      hasDiscount,
      orderBy,
    });
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Product> {
    return this.productService.findById(id);
  }

  @Post()
  create(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }

  @Post('seed')
  seed(@Body() seedProductDto: { quantity: number }): Promise<Product[]> {
    const { quantity = 200 } = seedProductDto;

    return this.productService.seed(quantity);
  }
}

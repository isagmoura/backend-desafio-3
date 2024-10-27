import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { faker } from '@faker-js/faker';

export enum ProductsOrderBy {
  PriceAsc = '1',
  PriceDesc = '2',
}

export type CreateProductDto = Omit<
  Product,
  'id' | 'created_date' | 'updated_date'
>;

const seedMiniImages = [
  'https://i.postimg.cc/XYD2ts21/miniatura1-sofa.png',
  'https://i.postimg.cc/XYvH2Rgy/miniatura2-sofa.png',
  'https://i.postimg.cc/DzJCh1Hv/miniatura3-sofa.png',
  'https://i.postimg.cc/KY608Rhn/miniatura4-sofa.png',
];
const seedImages = [
  'https://i.postimg.cc/RV4bt66d/abajur.png',
  'https://i.postimg.cc/sDmH4j5r/cadeira.png',
  'https://i.postimg.cc/Qtc09hjv/mesa.png',
  'https://i.postimg.cc/Z5gcwCR1/sofa.png',
  'https://i.postimg.cc/kGcsss6c/sofa-grande.png',
  'https://i.postimg.cc/DyvBZ9HY/sofa-grande2.png',
  'https://i.postimg.cc/3Jt9DLHr/sofa-pequeno.png',
  'https://i.postimg.cc/y8WjhFVm/sofa-sala.png',
];

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(filters: {
    limit?: number;
    offset?: number;
    categories?: string[];
    hasDiscount?: boolean;
    orderBy?: ProductsOrderBy;
  }): Promise<{
    items: Product[];
    meta: { total: number };
  }> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .take(filters.limit)
      .skip(filters.offset);

    if (filters.categories) {
      queryBuilder.andWhere('product.category IN (:...categories)', {
        categories: filters.categories,
      });
    }

    if (filters.hasDiscount) {
      queryBuilder.andWhere('product.discount_percent > 0');
    }

    if (filters.orderBy) {
      const orderDirection =
        filters.orderBy === ProductsOrderBy.PriceAsc ? 'ASC' : 'DESC';
      queryBuilder.orderBy(
        'coalesce(product.discount_price, product.price)',
        orderDirection,
      );
    }

    const [products, productsCount] = await queryBuilder.getManyAndCount();

    return { items: products, meta: { total: productsCount } };
  }

  findById(id: number): Promise<Product> {
    return this.productsRepository.findOneOrFail({
      where: { id },
      relations: { category: true },
    });
  }

  create(product: CreateProductDto): Promise<Product> {
    return this.productsRepository.save(product);
  }

  async seed(quantity: number): Promise<Product[]> {
    const categories = await this.categoriesRepository.find();

    if (categories.length === 0) {
      console.warn('No categories found. Seed categories first!');
      return [];
    }

    const products: CreateProductDto[] = Array.from(
      { length: quantity },
      () => {
        const price = faker.number.int({ min: 10, max: 10000 });
        const discount =
          Math.random() < 0.5 ? faker.number.int({ min: 5, max: 50 }) : null;

        return {
          category: faker.helpers.arrayElement(categories),
          description: faker.commerce.productName(),
          large_description: faker.lorem.words(36),
          name: faker.commerce.product(),
          is_new: Math.random() < 0.2,
          sku: faker.commerce.isbn(10).slice(0, 8),
          price,
          discount_percent: discount,
          discount_price: discount ? price * (1 - discount / 100) : null,
          image_link: faker.helpers.arrayElement(seedImages),
          other_images_link: faker.helpers
            .arrayElements(seedMiniImages, 3)
            .join(';'),
        };
      },
    );

    return Promise.all(products.map((products) => this.create(products)));
  }
}

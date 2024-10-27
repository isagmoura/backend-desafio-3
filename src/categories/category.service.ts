import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

export type CreateCategoryDto = Pick<Category, 'name' | 'image_link'>;

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findById(id: number): Promise<Category[]> {
    return this.categoriesRepository.findBy({ id });
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  create(category: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.save(category);
  }

  async seed() {
    if (await this.categoriesRepository.count()) {
      console.warn('Categories already seeded!');

      return [];
    }

    const categories: CreateCategoryDto[] = [
      {
        name: 'Dining',
        image_link: 'https://i.postimg.cc/XNcsnjHC/jantar.png',
      },
      { name: 'Living', image_link: 'https://i.postimg.cc/Xq3x9mJq/sala.png' },
      {
        name: 'Bedroom',
        image_link: 'https://i.postimg.cc/MTJY8N15/quarto.png',
      },
    ];

    return Promise.all(categories.map((category) => this.create(category)));
  }
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 10 })
  sku: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  })
  category: Category;

  @Column({ length: 250 })
  description: string;

  @Column({ length: 500 })
  large_description: string;

  @Column('decimal')
  price: number;

  @Column('decimal', { nullable: true })
  discount_price: number;

  @Column({ nullable: true })
  discount_percent: number;

  @Column({ default: false })
  is_new: boolean;

  @Column({ length: 250 })
  image_link: string;

  @Column({ length: 1000, nullable: true })
  other_images_link: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_date: Date;
}

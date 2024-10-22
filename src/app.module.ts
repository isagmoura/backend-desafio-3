import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './products/product.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'YOUR_USERNAME',
      password: 'YOUR_PASSWORD',
      database: 'YOUR_DATABASE',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, 
    }),
    ProductModule,
  ],

})
export class AppModule {}

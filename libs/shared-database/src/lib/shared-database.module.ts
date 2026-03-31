import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'bds_db',
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production', // Tự động tạo bảng nếu chưa có khi ở môi trường phát triển
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class SharedDatabaseModule {}

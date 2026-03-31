import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const grpcPort = process.env.GRPC_PORT || 5002;
  const httpPort = process.env.PORT || 3002;

  // Cấu hình gRPC Microservice kết nối song song với HTTP
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(process.cwd(), 'libs/shared-core/src/proto/user.proto'),
      url: `0.0.0.0:${grpcPort}`,
    },
  });

  // Khởi chạy gRPC
  await app.startAllMicroservices();

  // Khởi chạy HTTP (REST & GraphQL Federation)
  await app.listen(httpPort);
  console.log(`User Service running on HTTP port ${httpPort} and gRPC port ${grpcPort}`);
}

bootstrap();

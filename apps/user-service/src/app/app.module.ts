import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { UserController } from '../infrastructure/inbound/controllers/user.controller';
import { IUserUseCase } from '../core/ports/inbound/user.use-case.port';
import { UserService } from '../application/services/user.service';
import { IUserRepository } from '../core/ports/outbound/user.repository.port';
import { PostgresUserRepository } from '../infrastructure/outbound/database/postgres-user.repository';
import { UserResolver } from '../infrastructure/inbound/graphql/resolvers/user.resolver';
import { SharedDatabaseModule } from '@core-bds/shared-database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from '../infrastructure/outbound/database/schemas/user.schema';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    SharedDatabaseModule, // Kết nối đến Postgres Database chung
    TypeOrmModule.forFeature([UserSchema]), // Cấp quyền Repositories riêng của Service này
  ],
  controllers: [UserController],
  providers: [
    UserResolver,
    {
      provide: IUserUseCase,
      useClass: UserService,
    },
    {
      provide: IUserRepository,
      useClass: PostgresUserRepository,
    }
  ],
})
export class AppModule {}
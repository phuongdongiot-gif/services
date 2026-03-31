import { Module } from '@nestjs/common';
import { UserController } from '../infrastructure/inbound/controllers/user.controller';
import { IUserUseCase } from '../core/ports/inbound/user.use-case.port';
import { UserService } from '../application/services/user.service';
import { IUserRepository } from '../core/ports/outbound/user.repository.port';
import { PostgresUserRepository } from '../infrastructure/outbound/database/postgres-user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
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
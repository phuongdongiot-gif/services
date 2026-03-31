const fs = require('fs');
const path = require('path');

const src = path.join(process.cwd(), 'apps/user-service/src');

const files = [
  {
    path: 'core/domain/entities/user.entity.ts',
    content: `export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly role: string
  ) {}
}`
  },
  {
    path: 'core/ports/outbound/user.repository.port.ts',
    content: `import { User } from '../../domain/entities/user.entity';

export abstract class IUserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
  abstract findAll(): Promise<User[]>;
}`
  },
  {
    path: 'core/ports/inbound/user.use-case.port.ts',
    content: `import { User } from '../../domain/entities/user.entity';

export abstract class IUserUseCase {
  abstract getUserProfile(id: string): Promise<User | null>;
  abstract registerUser(username: string, email: string, role: string): Promise<User>;
}`
  },
  {
    path: 'application/services/user.service.ts',
    content: `import { Injectable } from '@nestjs/common';
import { IUserUseCase } from '../../core/ports/inbound/user.use-case.port';
import { IUserRepository } from '../../core/ports/outbound/user.repository.port';
import { User } from '../../core/domain/entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService implements IUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUserProfile(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async registerUser(username: string, email: string, role: string): Promise<User> {
    const user = new User(randomUUID(), username, email, role);
    await this.userRepository.save(user);
    return user;
  }
}`
  },
  {
    path: 'infrastructure/outbound/database/postgres-user.repository.ts',
    content: `import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../core/ports/outbound/user.repository.port';
import { User } from '../../../core/domain/entities/user.entity';

@Injectable()
export class PostgresUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}`
  },
  {
    path: 'infrastructure/inbound/controllers/user.controller.ts',
    content: `import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IUserUseCase } from '../../../core/ports/inbound/user.use-case.port';

@Controller('users')
export class UserController {
  constructor(private readonly userUseCase: IUserUseCase) {}

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    const user = await this.userUseCase.getUserProfile(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }

  @Post()
  async register(@Body() body: { username: string, email: string, role: string }) {
    return this.userUseCase.registerUser(body.username, body.email, body.role);
  }
}`
  },
  {
    path: 'app/app.module.ts',
    content: `import { Module } from '@nestjs/common';
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
export class AppModule {}`
  }
];

files.forEach(f => {
  const fullPath = path.join(src, f.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, f.content);
});
console.log('User service PoC files generated.');

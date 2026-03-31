import { Injectable } from '@nestjs/common';
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
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../core/ports/outbound/user.repository.port';
import { User } from '../../../core/domain/entities/user.entity';
import { UserSchema } from './schemas/user.schema';

@Injectable()
export class PostgresUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
  ) {}

  private mapToDomain(schema: UserSchema): User {
    return new User(schema.id, schema.username, schema.email, schema.role);
  }

  private mapToSchema(domain: User): UserSchema {
    const schema = new UserSchema();
    schema.id = domain.id;
    schema.username = domain.username;
    schema.email = domain.email;
    schema.role = domain.role;
    return schema;
  }

  async findById(id: string): Promise<User | null> {
    const userSchema = await this.userRepository.findOne({ where: { id } });
    if (!userSchema) return null;
    return this.mapToDomain(userSchema);
  }

  async save(user: User): Promise<void> {
    const userSchema = this.mapToSchema(user);
    await this.userRepository.save(userSchema);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map(user => this.mapToDomain(user));
  }
}
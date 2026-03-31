import { Injectable } from '@nestjs/common';
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
}
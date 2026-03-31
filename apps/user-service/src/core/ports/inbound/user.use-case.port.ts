import { User } from '../../domain/entities/user.entity';

export abstract class IUserUseCase {
  abstract getUserProfile(id: string): Promise<User | null>;
  abstract registerUser(username: string, email: string, role: string): Promise<User>;
}
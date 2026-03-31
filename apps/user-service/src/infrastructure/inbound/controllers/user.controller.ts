import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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
}
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
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

  // gRPC Method (Tự động map với service UserService và rpc GetUser trong file .proto)
  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: { id: string }) {
    const user = await this.userUseCase.getUserProfile(data.id);
    if (!user) {
      throw new Error('User not found');
    }
    // Return Object map directly to UserResponse in proto
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
}
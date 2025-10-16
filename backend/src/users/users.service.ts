import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async createUser(user: CreateUserDto) {
    const existing = await this.usersRepo.findByEmail(user.email);
    if (existing) {
      throw new ConflictException('Já existe um usuário com este email.');
    }

    const hashed = await bcrypt.hash(user.password, 10);
    const newUser = await this.usersRepo.createUser({
      email: user.email,
      password: hashed,
    });
    const { password: _, ...safe } = newUser;
    return safe;
  }

  async findMe(currentUserId: number) {
    const user = await this.usersRepo.findById(currentUserId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { password, ...safe } = user;
    return safe;
  }
}

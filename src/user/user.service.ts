import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { FindOneOptions } from 'typeorm';
import { ChatGateway } from '../chat/chat.gateway';
import { FilterUserDTO } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private chatGateway: ChatGateway,
  ) {}

  async findUserbyEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    return user;
  }

  async saveUser(user: User) {
    const usersaved: User = await this.userRepository.save(user);
    this.chatGateway.wss.emit('users/new', usersaved);
    return usersaved;
  }

  async findByUsernameOrEmail(username: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('users')
      .where('users.username= :username', { username })
      .orWhere('users.email= :username', { username })
      .getOne();
  }

  async getUsers(filter: FilterUserDTO): Promise<User[]> {
    return this.userRepository.getUsers(filter);
  }
}

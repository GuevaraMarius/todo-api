import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { EStatus } from './status.enum';
import { Todo } from './todo.model';
import { User } from 'src/user/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private todoModel: typeof Todo,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(
    page: number = 1,
    limit: number,
    status?: EStatus,
  ): Promise<Todo[]> {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return this.todoModel.findAll({
      where,
      limit,
      offset: (page - 1) * limit,
      include: [User],
    });
  }

  async findUserTodos(
    userId: number,
    page: number = 1,
    limit?: number,
    status?: EStatus,
  ): Promise<Todo[]> {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }
    return this.todoModel.findAll({
      where,
      limit,
      offset: (page - 1) * limit,
      include: [User],
    });
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModel.findByPk(id, { include: [User] });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }
  async create(todo: Partial<Todo>, userId: string): Promise<Todo> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    try {
      const newTodo = await this.todoModel.create({
        ...todo,
        userId,
      });
      return newTodo;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Todo already exists');
      }
      throw new InternalServerErrorException('Failed to create todo');
    }
  }

  async update(id: string, updates: Partial<Todo>): Promise<Todo> {
    console.log('Service update called with:', { id, updates });
    const todo = await this.findOne(id);
    console.log('Found todo:', todo);

    try {
      await todo.set(updates);
      console.log('Set updates, about to save...');
      await todo.save();
      console.log('Save completed, returning todo');
      return todo;
    } catch (error) {
      console.error('Service update error:', error); // Add this line
      if (error instanceof ConflictException) {
        throw new ConflictException('Todo with the same title already exists');
      }
      throw new InternalServerErrorException('Failed to update todo');
    }
  }
  async remove(id: string): Promise<void> {
    const todo = await this.findOne(id);
    try {
      await todo.destroy();
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete todo');
    }
  }
}

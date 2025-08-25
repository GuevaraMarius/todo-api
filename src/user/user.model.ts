import { Table, Column, DataType, Model, HasMany } from 'sequelize-typescript';
import { Todo } from 'src/todo/todo.model';
import { ERole } from './role.enum';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM(...Object.values(ERole)),
    allowNull: false,
    defaultValue: ERole.USER,
  })
  role: ERole;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date;

  @HasMany(() => Todo)
  todos: Todo[];
}

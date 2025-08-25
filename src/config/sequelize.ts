import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Todo } from 'src/todo/todo.model';
import { User } from 'src/user/user.model';

export default () => ({
  SEQUELIZE: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    models: [User, Todo],
    autoLoadModels: true,
    synchronize: true,
    retryAttempts: 1,
    retryDelay: 1000,
  } as SequelizeModuleOptions,
});

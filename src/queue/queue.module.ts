import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { TodoModule } from 'src/todo/todo.module';

@Module({
  imports: [forwardRef(() => TodoModule)],
  providers: [
    ReminderService,
    {
      provide: 'REMINDER_QUEUE',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Queue('reminder-queue', {
          connection: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
        });
      },
    },
  ],
  controllers: [ReminderController],
  exports: ['REMINDER_QUEUE'],
})
export class QueueModule {}

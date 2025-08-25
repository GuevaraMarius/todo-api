import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { TodoService } from '../todo/todo.service';
import { EStatus } from 'src/todo/status.enum';

@Injectable()
export class ReminderService {
  private worker: Worker;

  constructor(
    @Inject('REMINDER_QUEUE') private reminderQueue: Queue,
    private config: ConfigService,
    @Inject(forwardRef(() => TodoService)) private todoService: TodoService,
  ) {
    console.log('ReminderService constructor called');

    this.worker = new Worker(
      'reminder-queue',
      async (job) => {
        console.log('Worker processing job:', job.data);

        try {
          if (!job.data.userId) {
            throw new Error('UserId is required for reminder');
          }

          const todo = await this.todoService.create(
            {
              title: job.data.message,
              description: 'Auto-generated reminder',
              status: EStatus.PENDING,
            },
            job.data.userId,
          );

          console.log('Reminder todo created for user:', todo.user.id);
        } catch (error) {
          console.error('Worker job error:', error.message);
        }
      },
      {
        connection: {
          host: this.config.get('REDIS_HOST'),
          port: parseInt(this.config.get('REDIS_PORT')),
        },
      },
    );
  }

  async scheduleReminder(userId: string) {
    try {
      if (!userId) {
        throw new Error('UserId is required to schedule reminders');
      }

      const job = await this.reminderQueue.add(
        'break-reminder',
        { message: 'Take a 5 min break 🧘', userId },
        {
          repeat: { every: 1000 * 60 * 30 },
          jobId: `break-reminder-${userId}`,
        },
      );
      console.log('Job added successfully:', job.id);
    } catch (error) {
      throw error;
    }
  }
}

import { Controller, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ERole } from 'src/user/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { AllExceptionsFilter } from 'src/todo/filters/all-exceptions.filter';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('reminder')
@ApiBearerAuth()
@Controller('remider')
@UseFilters(AllExceptionsFilter)
export class ReminderController {
  constructor(private reminderService: ReminderService) {}

  @Post('schedule')
  @Roles(ERole.USER)
  async scheduleReminder(@Req() req: any) {
    try {
      const userId = req.user.userId;
      console.log('Request user:', req.user);
      console.log('Extracted userId:', userId);

      await this.reminderService.scheduleReminder(userId);
      return { status: 'Reminder scheduled!' };
    } catch (error) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}

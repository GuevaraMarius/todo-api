import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, MinDate } from 'class-validator';
import { EStatus } from '../status.enum';
import { Type } from 'class-transformer';
import dayjs from 'dayjs';
export class CreateTodoDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @MinDate(dayjs().startOf('day').toDate(), {
    message: 'Deadline must be today or a future date',
  })
  @Type(() => Date)
  deadline: Date;

  @ApiProperty({ default: EStatus.PENDING })
  status: EStatus;
}

export class UpdateTodoDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  title?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsDate()
  @MinDate(dayjs().startOf('day').toDate(), {
    message: 'Deadline must be today or a future date',
  })
  @Type(() => Date)
  deadline?: Date;
  @ApiProperty({
    required: false,
    enum: EStatus,
    enumName: 'EStatus',
    description: 'Status of the todo',
  })
  @IsEnum(EStatus, { message: 'Status must be a valid enum value' })
  status?: EStatus;
}

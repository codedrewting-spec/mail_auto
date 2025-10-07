import { ApiProperty } from '@nestjs/swagger';
import { FocusSession, FocusSessionSchema } from '@focusflow/types';

export class CreateFocusSessionDto implements FocusSession {
  @ApiProperty({ required: false, format: 'uuid' })
  id?: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  taskId!: string | null;

  @ApiProperty({ format: 'date-time' })
  start!: string;

  @ApiProperty({ format: 'date-time' })
  end!: string;

  @ApiProperty({ example: 0 })
  interruptions!: number;

  @ApiProperty({ example: 'web-client-1' })
  deviceId!: string;

  @ApiProperty({ enum: ['completed', 'interrupted', 'timeout'] })
  status!: 'completed' | 'interrupted' | 'timeout';
}

export const FocusSessionPayloadSchema = FocusSessionSchema;

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TaskPriority,
  TaskPrioritySchema,
  TaskSpace,
  TaskSpaceSchema,
  TaskStatus,
  TaskStatusSchema
} from '@focusflow/types';
import { z } from 'zod';

export const SubtaskInputSchema = z.object({
  title: z.string().min(1),
  due: z.string().datetime().optional(),
  isCompleted: z.boolean().optional()
});

export const TaskPayloadSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  due: z.string().datetime().optional(),
  estimateMinutes: z.number().int().min(0).optional(),
  priority: TaskPrioritySchema.default('medium'),
  tags: z.array(z.string()).default([]),
  space: TaskSpaceSchema,
  status: TaskStatusSchema.default('backlog'),
  projectId: z.string().uuid().nullable().optional(),
  ownerId: z.string().uuid(),
  subtasks: z.array(SubtaskInputSchema).optional()
});

export class CreateTaskDto implements z.infer<typeof TaskPayloadSchema> {
  @ApiProperty({ example: 'Publish sprint review deck' })
  title!: string;

  @ApiPropertyOptional({ example: 'Add Q1 OKRs and charts' })
  description?: string;

  @ApiPropertyOptional({ example: '2024-02-01T09:00:00.000Z' })
  due?: string;

  @ApiPropertyOptional({ example: 50 })
  estimateMinutes?: number;

  @ApiProperty({ enum: ['low', 'medium', 'high'], default: 'medium' })
  priority!: TaskPriority;

  @ApiProperty({ type: [String], example: ['focus', 'deep-work'] })
  tags!: string[];

  @ApiProperty({ enum: ['work', 'life'], default: 'work' })
  space!: TaskSpace;

  @ApiProperty({ enum: ['backlog', 'in_progress', 'completed', 'archived'], default: 'backlog' })
  status!: TaskStatus;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  projectId?: string | null;

  @ApiProperty({ format: 'uuid' })
  ownerId!: string;

  @ApiPropertyOptional({ type: () => [SubtaskInput] })
  subtasks?: SubtaskInput[];
}

export class SubtaskInput implements z.infer<typeof SubtaskInputSchema> {
  @ApiProperty({ example: 'Outline the deck narrative' })
  title!: string;

  @ApiPropertyOptional({ example: '2024-01-31T12:00:00.000Z' })
  due?: string;

  @ApiPropertyOptional({ default: false })
  isCompleted?: boolean;
}

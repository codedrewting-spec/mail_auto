import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const CompleteTaskSchema = z.object({
  ownerId: z.string().uuid(),
  completedAt: z.string().datetime().optional()
});

export class CompleteTaskDto implements z.infer<typeof CompleteTaskSchema> {
  @ApiProperty({ format: 'uuid', description: 'Owner identifier for authorization checks.' })
  ownerId!: string;

  @ApiPropertyOptional({ format: 'date-time', description: 'Custom completion timestamp.' })
  completedAt?: string;
}

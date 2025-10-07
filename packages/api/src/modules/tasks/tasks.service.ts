import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTaskDto, TaskPayloadSchema } from './dto/create-task.dto';
import { CompleteTaskDto, CompleteTaskSchema } from './dto/complete-task.dto';
import {
  TaskPriority as PrismaTaskPriority,
  TaskSpace as PrismaTaskSpace,
  TaskStatus as PrismaTaskStatus
} from '@prisma/client';
import { PointsService } from '../points/points.service';
import { TaskSpaceSchema } from '@focusflow/types';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly points: PointsService
  ) {}

  async create(dto: CreateTaskDto) {
    const payload = TaskPayloadSchema.parse(dto);
    return this.prisma.task.create({
      data: {
        title: payload.title,
        description: payload.description,
        dueAt: payload.due ? new Date(payload.due) : null,
        estimateMinutes: payload.estimateMinutes ?? null,
        priority: this.toPrismaPriority(payload.priority),
        tags: payload.tags,
        space: this.toPrismaSpace(payload.space),
        status: this.toPrismaStatus(payload.status),
        projectId: payload.projectId ?? null,
        ownerId: payload.ownerId,
        subtasks: payload.subtasks
          ? {
              create: payload.subtasks.map((subtask) => ({
                title: subtask.title,
                dueAt: subtask.due ? new Date(subtask.due) : null,
                isCompleted: subtask.isCompleted ?? false
              }))
            }
          : undefined
      },
      include: {
        subtasks: true
      }
    });
  }

  findAll(space?: string) {
    const normalized = space ? space.toLowerCase() : undefined;
    const parsedSpace = normalized ? TaskSpaceSchema.parse(normalized) : undefined;
    return this.prisma.task.findMany({
      where: parsedSpace
        ? {
            space: this.toPrismaSpace(parsedSpace)
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        subtasks: true
      }
    });
  }

  async completeTask(id: string, dto: CompleteTaskDto) {
    const payload = CompleteTaskSchema.parse(dto);
    const existing = await this.prisma.task.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    if (existing.ownerId !== payload.ownerId) {
      throw new ForbiddenException('You are not allowed to update this task');
    }

    const completedAt = payload.completedAt ? new Date(payload.completedAt) : new Date();

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        status: PrismaTaskStatus.COMPLETED,
        completedAt
      },
      include: {
        subtasks: true
      }
    });

    await this.points.awardTaskCompletion(task.id, task.ownerId);

    return task;
  }

  private toPrismaSpace(space: string) {
    return space === 'life' ? PrismaTaskSpace.LIFE : PrismaTaskSpace.WORK;
  }

  private toPrismaPriority(priority: string) {
    switch (priority) {
      case 'low':
        return PrismaTaskPriority.LOW;
      case 'high':
        return PrismaTaskPriority.HIGH;
      default:
        return PrismaTaskPriority.MEDIUM;
    }
  }

  private toPrismaStatus(status: string) {
    switch (status) {
      case 'in_progress':
        return PrismaTaskStatus.IN_PROGRESS;
      case 'completed':
        return PrismaTaskStatus.COMPLETED;
      case 'archived':
        return PrismaTaskStatus.ARCHIVED;
      default:
        return PrismaTaskStatus.BACKLOG;
    }
  }
}

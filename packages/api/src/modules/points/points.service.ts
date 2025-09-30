import { Injectable } from '@nestjs/common';
import { FocusStatus, PointsReason, PointsSourceType } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  async awardFocusSession(sessionId: string, userId: string, status: FocusStatus, points = 3) {
    if (status !== FocusStatus.COMPLETED) {
      return null;
    }

    return this.prisma.pointsLedger.upsert({
      where: {
        sourceType_sourceId: {
          sourceType: PointsSourceType.FOCUS_SESSION,
          sourceId: sessionId
        }
      },
      update: {},
      create: {
        points,
        reason: PointsReason.FOCUS_COMPLETED,
        sourceType: PointsSourceType.FOCUS_SESSION,
        sourceId: sessionId,
        userId
      }
    });
  }

  async awardTaskCompletion(taskId: string, userId: string, points = 5) {
    return this.prisma.pointsLedger.upsert({
      where: {
        sourceType_sourceId: {
          sourceType: PointsSourceType.TASK,
          sourceId: taskId
        }
      },
      update: {},
      create: {
        points,
        reason: PointsReason.TASK_COMPLETED,
        sourceType: PointsSourceType.TASK,
        sourceId: taskId,
        userId
      }
    });
  }

  async getUserPoints(userId: string) {
    return this.prisma.pointsLedger.aggregate({
      where: { userId },
      _sum: { points: true }
    });
  }
}

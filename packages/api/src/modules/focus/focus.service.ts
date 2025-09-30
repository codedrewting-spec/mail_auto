import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BadgeType,
  FocusStatus as PrismaFocusStatus
} from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFocusSessionDto, FocusSessionPayloadSchema } from './dto/create-session.dto';
import { PointsService } from '../points/points.service';
import { computeMerkleRoot, focusSessionLeaf } from '../../shared/merkle';

@Injectable()
export class FocusService {
  private readonly chainEnabled = process.env.CHAIN_WRITE_ENABLED === 'true';

  constructor(
    private readonly prisma: PrismaService,
    private readonly points: PointsService
  ) {}

  async recordSession(dto: CreateFocusSessionDto) {
    const payload = FocusSessionPayloadSchema.parse(dto);
    const start = new Date(payload.start);
    const end = new Date(payload.end);

    if (end <= start) {
      throw new BadRequestException('Focus session end time must be after start time');
    }

    const durationMinutes = Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / (60 * 1000))
    );

    const session = await this.prisma.focusSession.create({
      data: {
        taskId: payload.taskId,
        userId: payload.userId,
        start,
        end,
        interruptions: payload.interruptions,
        deviceId: payload.deviceId,
        status: this.toPrismaStatus(payload.status),
        durationMinutes
      }
    });

    const summary = await this.refreshDailySummary(session.userId, start);

    await this.prisma.focusSession.update({
      where: { id: session.id },
      data: {
        summaryId: summary.id
      }
    });

    await this.points.awardFocusSession(session.id, session.userId, session.status);
    await this.updateFocusStreak(session.userId, start);

    return this.prisma.focusSession.findUnique({
      where: { id: session.id },
      include: { summary: true }
    });
  }

  findRecent(limit = 20) {
    return this.prisma.focusSession.findMany({
      include: { summary: true },
      orderBy: { start: 'desc' },
      take: limit
    });
  }

  async getDailySummary(userId: string, date?: string) {
    const target = date ? new Date(date) : new Date();
    const day = this.startOfDay(target);
    return this.prisma.dailyFocusSummary.findUnique({
      where: {
        userId_date: {
          userId,
          date: day
        }
      },
      include: {
        sessions: true,
        badges: true
      }
    });
  }

  private async refreshDailySummary(userId: string, timestamp: Date) {
    const dayStart = this.startOfDay(timestamp);
    const dayEnd = this.endOfDay(timestamp);

    const [sessions, summary] = await Promise.all([
      this.prisma.focusSession.findMany({
        where: {
          userId,
          start: {
            gte: dayStart,
            lte: dayEnd
          }
        },
        orderBy: { start: 'asc' }
      }),
      this.prisma.dailyFocusSummary.upsert({
        where: {
          userId_date: {
            userId,
            date: dayStart
          }
        },
        update: {},
        create: {
          userId,
          date: dayStart,
          merkleRoot: '0x' + '0'.repeat(64),
          chainEnabled: this.chainEnabled
        }
      })
    ]);

    const leaves = sessions.map((session) =>
      focusSessionLeaf({
        id: session.id,
        taskId: session.taskId,
        start: session.start,
        end: session.end,
        interruptions: session.interruptions
      })
    );

    const merkleRoot = computeMerkleRoot(leaves);

    const updatedSummary = await this.prisma.dailyFocusSummary.update({
      where: { id: summary.id },
      data: { merkleRoot },
      include: {
        sessions: true
      }
    });

    await this.prisma.focusSession.updateMany({
      where: {
        userId,
        start: {
          gte: dayStart,
          lte: dayEnd
        }
      },
      data: { summaryId: summary.id }
    });

    await this.ensureSevenDayBadge(userId, dayStart);

    return updatedSummary;
  }

  private async updateFocusStreak(userId: string, reference: Date) {
    const sessions = await this.prisma.focusSession.findMany({
      where: {
        userId,
        status: PrismaFocusStatus.COMPLETED
      },
      orderBy: { start: 'desc' },
      take: 30
    });

    const completedDays = new Set(
      sessions.map((session) => this.dateKey(session.start))
    );

    let streak = 0;
    const cursor = this.startOfDay(reference);

    while (completedDays.has(this.dateKey(cursor))) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const longest = Math.max(user?.streakLongest ?? 0, streak);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        streakCurrent: streak,
        streakLongest: longest
      }
    });
  }

  private async ensureSevenDayBadge(userId: string, referenceDay: Date) {
    const summaries = await this.prisma.dailyFocusSummary.findMany({
      where: {
        userId,
        date: {
          lte: referenceDay
        }
      },
      orderBy: { date: 'desc' },
      take: 7,
      include: {
        sessions: true
      }
    });

    if (summaries.length < 7) {
      return;
    }

    const hasGap = summaries.some((summary, index) => {
      if (index === 0) {
        return false;
      }
      const previous = this.startOfDay(summaries[index - 1].date);
      const expected = this.shiftDays(previous, -1);
      return this.dateKey(summary.date) !== this.dateKey(expected);
    });

    if (hasGap) {
      return;
    }

    const qualifies = summaries.every((summary) =>
      summary.sessions.some((session) => session.status === PrismaFocusStatus.COMPLETED)
    );

    if (!qualifies) {
      return;
    }

    const periodRoot = computeMerkleRoot(
      summaries.map((summary) => summary.merkleRoot)
    );

    const existing = await this.prisma.badge.findFirst({
      where: {
        userId,
        badgeType: BadgeType.SEVEN_DAY_STREAK,
        periodRoot
      }
    });

    if (existing) {
      return;
    }

    await this.prisma.badge.create({
      data: {
        userId,
        badgeType: BadgeType.SEVEN_DAY_STREAK,
        periodRoot,
        chainEnabled: this.chainEnabled,
        summaryId: summaries[0].id
      }
    });
  }

  private toPrismaStatus(status: string): PrismaFocusStatus {
    switch (status) {
      case 'interrupted':
        return PrismaFocusStatus.INTERRUPTED;
      case 'timeout':
        return PrismaFocusStatus.TIMEOUT;
      default:
        return PrismaFocusStatus.COMPLETED;
    }
  }

  private startOfDay(date: Date) {
    const clone = new Date(date);
    clone.setUTCHours(0, 0, 0, 0);
    return clone;
  }

  private endOfDay(date: Date) {
    const clone = new Date(date);
    clone.setUTCHours(23, 59, 59, 999);
    return clone;
  }

  private dateKey(date: Date) {
    return this.startOfDay(date).toISOString().slice(0, 10);
  }

  private shiftDays(date: Date, delta: number) {
    const shifted = new Date(date);
    shifted.setUTCDate(shifted.getUTCDate() + delta);
    return shifted;
  }
}

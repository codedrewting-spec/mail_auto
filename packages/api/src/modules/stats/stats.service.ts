import { Injectable } from '@nestjs/common';
import { FocusStatus, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const now = new Date();
    const weekStart = this.startOfDay(this.shiftDays(now, -6));
    const monthStart = this.startOfDay(this.shiftDays(now, -29));

    const sessions = await this.prisma.focusSession.findMany({
      where: {
        userId,
        status: FocusStatus.COMPLETED,
        start: {
          gte: monthStart
        }
      },
      orderBy: { start: 'asc' }
    });

    const tasks = await this.prisma.task.findMany({
      where: {
        ownerId: userId,
        status: TaskStatus.COMPLETED,
        completedAt: {
          not: null,
          gte: monthStart
        }
      },
      select: { completedAt: true }
    });

    const monthFocusMinutes = sessions.reduce((total, session) => total + session.durationMinutes, 0);
    const weekFocusMinutes = sessions
      .filter((session) => session.start >= weekStart)
      .reduce((total, session) => total + session.durationMinutes, 0);

    const monthTaskCount = tasks.length;
    const weekTaskCount = tasks.filter((task) => task.completedAt && task.completedAt >= weekStart).length;

    const dayBuckets = new Map<string, number>();
    for (const session of sessions) {
      const key = this.dateKey(session.start);
      dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + session.durationMinutes);
    }

    const lastSevenDays: { date: string; focusMinutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = this.shiftDays(now, -i);
      const key = this.dateKey(day);
      lastSevenDays.push({ date: key, focusMinutes: dayBuckets.get(key) ?? 0 });
    }

    const consecutiveDays = this.calculateStreak(now, dayBuckets);

    return {
      userId,
      week: {
        focusMinutes: weekFocusMinutes,
        completedTasks: weekTaskCount
      },
      month: {
        focusMinutes: monthFocusMinutes,
        completedTasks: monthTaskCount
      },
      consecutiveDays,
      lastSevenDays
    };
  }

  private calculateStreak(reference: Date, buckets: Map<string, number>): number {
    let streak = 0;
    const cursor = this.startOfDay(reference);

    while ((buckets.get(this.dateKey(cursor)) ?? 0) > 0) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    return streak;
  }

  private dateKey(date: Date): string {
    const d = this.startOfDay(date);
    return d.toISOString().slice(0, 10);
  }

  private startOfDay(date: Date): Date {
    const clone = new Date(date);
    clone.setUTCHours(0, 0, 0, 0);
    return clone;
  }

  private shiftDays(date: Date, delta: number): Date {
    const shifted = new Date(date);
    shifted.setUTCDate(shifted.getUTCDate() + delta);
    return shifted;
  }
}

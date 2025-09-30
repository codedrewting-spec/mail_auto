import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../common/prisma/prisma.module';
import { HealthModule } from '../modules/health/health.module';
import { TasksModule } from '../modules/tasks/tasks.module';
import { FocusModule } from '../modules/focus/focus.module';
import { PointsModule } from '../modules/points/points.module';
import { StatsModule } from '../modules/stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PointsModule,
    HealthModule,
    TasksModule,
    FocusModule,
    StatsModule
  ]
})
export class AppModule {}

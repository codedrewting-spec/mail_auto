import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('user/:userId/overview')
  @ApiOkResponse({ description: 'Aggregated focus and task statistics for the user.' })
  getOverview(@Param('userId') userId: string) {
    return this.statsService.getOverview(userId);
  }
}

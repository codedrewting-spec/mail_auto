import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateFocusSessionDto } from './dto/create-session.dto';
import { FocusService } from './focus.service';

@ApiTags('focus')
@Controller('focus')
export class FocusController {
  constructor(private readonly focusService: FocusService) {}

  @Post('sessions')
  record(@Body() dto: CreateFocusSessionDto) {
    return this.focusService.recordSession(dto);
  }

  @Get('sessions')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  list(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : undefined;
    const sanitized = parsedLimit && !Number.isNaN(parsedLimit) ? parsedLimit : undefined;
    return this.focusService.findRecent(sanitized);
  }

  @Get('summaries/:userId')
  @ApiOkResponse({ description: 'Daily merkle root summary for the requested date (defaults to today).' })
  summary(@Param('userId') userId: string, @Query('date') date?: string) {
    return this.focusService.getDailySummary(userId, date);
  }
}

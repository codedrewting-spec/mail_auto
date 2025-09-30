import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'space', required: false, enum: ['work', 'life'] })
  findAll(@Query('space') space?: string) {
    return this.tasksService.findAll(space);
  }

  @Patch(':id/complete')
  @ApiOkResponse({ description: 'Marks the task as completed and awards points.' })
  complete(@Param('id') id: string, @Body() dto: CompleteTaskDto) {
    return this.tasksService.completeTask(id, dto);
  }
}

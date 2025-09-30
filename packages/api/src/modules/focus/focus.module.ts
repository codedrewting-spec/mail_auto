import { Module } from '@nestjs/common';
import { FocusService } from './focus.service';
import { FocusController } from './focus.controller';

@Module({
  providers: [FocusService],
  controllers: [FocusController]
})
export class FocusModule {}

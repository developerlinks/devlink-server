import { Module } from '@nestjs/common';
import { TextPolisherService } from './text-polisher.service';
import { TextPolisherController } from './text-polisher.controller';

@Module({
  providers: [TextPolisherService],
  controllers: [TextPolisherController],
})
export class TextPolisherModule {}

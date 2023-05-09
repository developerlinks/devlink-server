import { Body, Controller, Post } from '@nestjs/common';
import { TextPolisherService } from './text-polisher.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TextPolishDto } from './dto/text-polisher.dto';

@ApiTags('AI')
@Controller('ai/text-polisher')
export class TextPolisherController {
  constructor(private readonly textPolisherService: TextPolisherService) {}

  @ApiOperation({ summary: '文字润色' })
  @ApiBody({ description: '需要润色的文本', type: TextPolishDto })
  @ApiOkResponse({ description: '润色后的文本', type: String })
  @Post()
  async textPolish(@Body('text') text: string) {
    return this.textPolisherService.polishText(text);
  }
}

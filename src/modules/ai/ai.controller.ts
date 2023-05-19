import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TextPolishDto } from './dto/text-polisher.dto';
import { AiService } from './ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApiOperation({ summary: '文字润色' })
  @ApiBody({ description: '需要润色的文本', type: TextPolishDto })
  @ApiOkResponse({ description: '润色后的文本', type: String })
  @Post('/text-polisher')
  async textPolish(@Body('text') text: string) {
    return this.aiService.polishText(text);
  }
}

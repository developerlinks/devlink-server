import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { MAX_TOKENS, countTokens } from './utils';

@Injectable()
export class AiService {
  private openAiIns: OpenAIApi;

  constructor(private configService: ConfigService) {
    this.openAiIns = new OpenAIApi(
      new Configuration({
        apiKey: this.configService.get('OPENAI_API_KEY'),
        basePath: this.configService.get('OPEN_PROXY'),
      }),
    );
  }

  async polishText(inputText: string) {
    const tokens = countTokens(inputText);
    const isTokenOverLimit = tokens > MAX_TOKENS;
    if (isTokenOverLimit) {
      throw new BadRequestException('输入过长');
    }
    const prompt = `请帮我优化并提高以下这段文字的表达清晰度和质量，需要优化的文字为: "${inputText}"`;
    const response = await this.openAiIns.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: tokens,
      n: 1,
      stop: null,
      temperature: 0,
    });

    const polishedText = response.data.choices[0].text;

    return {
      text: polishedText,
    };
  }
}

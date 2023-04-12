import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class TextPolisherService {
  private openAiIns: OpenAIApi;

  constructor(private configService: ConfigService) {
    this.openAiIns = new OpenAIApi(
      new Configuration({
        apiKey: this.configService.get('OPENAI_API_KEY'),
        basePath: this.configService.get('OPEN_PROXY'),
      }),
    );
  }

  async polishText(inputText: string): Promise<string> {
    if (inputText.length > 1000) {
      throw new BadRequestException('Input text is too long.');
    }
    const prompt = `Please polish the following text: "${inputText}", And reply in the corresponding language.`;
    const response = await this.openAiIns.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: inputText.length * 2,
      n: 1,
      stop: null,
      temperature: 0.6,
    });

    const polishedText = response.data.choices[0].text;

    return polishedText;
  }
}

import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup';
import { getServerConfig } from '../ormconfig';

async function bootstrap() {
  const config = getServerConfig();

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
    },
  });
  app.setGlobalPrefix('api');
  setupApp(app);
  const port = typeof config['APP_PORT'] === 'string' ? parseInt(config['APP_PORT']) : 13000;
  await app.listen(port);
  await app.init();
}
bootstrap();

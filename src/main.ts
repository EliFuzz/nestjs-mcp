import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug'] });
  await app.listen(process.env.PORT ?? 3001);
  logger.log(`MCP Server is running on ${await app.getUrl()}/sse`);
}


bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});

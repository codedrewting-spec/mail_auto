import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  const logger = new Logger('Bootstrap');

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true }));

  const config = new DocumentBuilder()
    .setTitle('FocusFlow API')
    .setDescription('FocusFlow REST API for tasks, focus sessions, and rewards.')
    .setVersion('0.1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3333;
  await app.listen(port);
  logger.log(`API ready at http://localhost:${port}`);
}

bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import 'module-alias/register';
import { LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  await app.listen(3000);
}

bootstrap();

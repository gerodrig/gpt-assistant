import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //? Set ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //? Set global prefix
  app.setGlobalPrefix('/api');

  //? Enable CORS
  app.enableCors();

  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina datos que no estén en el DTO (limpieza automática)
    forbidNonWhitelisted: true, // Lanza error si envían datos extra
    transform: true, // Convierte tipos automáticamente si es necesario
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

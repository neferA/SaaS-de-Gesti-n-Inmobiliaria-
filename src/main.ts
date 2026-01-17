import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io'; //Importar el adaptador de Socket.IO

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'http://localhost:5173', // La URL exacta de tu React (Vite)
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true, // Permite envío de cookies o headers de autorización
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina datos que no estén en el DTO (limpieza automática)
    forbidNonWhitelisted: true, // Lanza error si envían datos extra
    transform: true, // Convierte tipos automáticamente si es necesario
  }));
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new IoAdapter(app)); 

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
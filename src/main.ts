import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io'; //Importar el adaptador de Socket.IO

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors(); // Activar CORS Esto permite que Postman y tu Frontend (React) se conecten sin ser bloqueados

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina datos que no estén en el DTO (limpieza automática)
    forbidNonWhitelisted: true, // Lanza error si envían datos extra
    transform: true, // Convierte tipos automáticamente si es necesario
  }));

  app.useWebSocketAdapter(new IoAdapter(app)); // SOLUCIÓN AL ERROR 404 Le decimos a NestJS: "Usa este adaptador para manejar los Sockets"

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
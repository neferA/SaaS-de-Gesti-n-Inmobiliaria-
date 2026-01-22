import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CONFIGURACIÓN CORS (Adaptada para Red Local)
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. VALIDACIONES GLOBALES
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Limpia datos basura del JSON
    forbidNonWhitelisted: true, // Lanza error 400 si envían campos extra
    transform: true,            // Convierte "1" a numero 1 automáticamente
  }));

  app.setGlobalPrefix('api');

  // 4. WEBSOCKETS
  app.useWebSocketAdapter(new IoAdapter(app)); 

  // 5. LEVANTAR SERVIDOR EN RED (0.0.0.0)
  const port = process.env.PORT ?? 3000;
  
  // '0.0.0.0' es CRUCIAL para exponer el backend a la red Wi-Fi
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Backend corriendo en: ${await app.getUrl()}`);
}
bootstrap();
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// 1. Configuración del Gateway
@WebSocketGateway({
  cors: {
    origin: '*', // ⚠️ Permite conexión desde cualquier frontend (React, Postman, etc.)
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  // 2. Esta es la instancia del Servidor de Sockets
  // La usaremos para enviar mensajes a TODOS los conectados (Broadcast)
  @WebSocketServer()
  server: Server;

  // Se ejecuta cuando alguien entra a la web
  handleConnection(client: Socket) {
    console.log(`🔌 Cliente conectado: ${client.id}`);
  }

  // Se ejecuta cuando alguien cierra la pestaña
  handleDisconnect(client: Socket) {
    console.log(`❌ Cliente desconectado: ${client.id}`);
  }

  // 3. (Opcional) Escuchar mensajes desde el cliente
  // Si el frontend envía un evento 'ping', respondemos 'pong'
  @SubscribeMessage('ping')
  handleMessage(@MessageBody() data: string): string {
    console.log('Mensaje recibido:', data);
    return 'pong';
  }
}
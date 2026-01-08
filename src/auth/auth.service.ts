import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    // 1. Buscar usuario en BD
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true } // Traemos el rol para meterlo en el token
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas (Email)');
    }

    // 2. Verificar contraseña (Hash vs Texto plano)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas (Password)');
    }

    // 3. Generar el Token (Payload)
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role?.name || 'USER', // Guardamos el rol dentro del token
      fullName: `${user.firstName} ${user.lastName}` 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role?.name
      }
    };
  }
}
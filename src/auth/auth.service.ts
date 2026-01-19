import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName, 
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role?.name
      }
    };
  }
  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // 1. Verificar si el usuario ya existe
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }

    // 2. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      include: { role: true } // Opcional: para devolver el rol creado
    });

    // 4. Retornamos el usuario (sin la contraseña)
    const { password: _, ...result } = newUser;
    return result;
  }
}

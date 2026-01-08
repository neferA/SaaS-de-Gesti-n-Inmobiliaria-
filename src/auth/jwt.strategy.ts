import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // Fallback por si falla el .env
    });
  }

  // Esta función se ejecuta si el token es válido
  async validate(payload: any) {
    // payload es lo que guardamos dentro del token (id y email)
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
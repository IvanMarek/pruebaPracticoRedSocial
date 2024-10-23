import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../usuarios/usuarios.service'; // Asegúrate de la ruta correcta
import { JwtPayload } from './jwt-payload.interface'; // Necesitarás definir esta interfaz

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: JwtPayload) {
    // Puedes obtener el usuario usando el payload (por ejemplo, payload.email)
    const user = await this.usuariosService.findByEmail(payload.email);
    return user; // Retorna el usuario o lanza un error si no existe
  }
}
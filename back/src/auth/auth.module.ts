import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt'; // Importar JwtModule
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  imports: [
    UsuariosModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // Clave secreta para firmar el token
      signOptions: { expiresIn: '1h' }, // Configura el tiempo de expiración del token
    }),
  ],
  providers: [AuthService, JwtStrategy], // Añadir JwtStrategy a los providers
  controllers: [AuthController],
})
export class AuthModule {}

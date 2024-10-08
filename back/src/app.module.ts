import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { usuario } from './usuarios/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports:[TypeOrmModule.forRoot({
    type: 'mysql',
    host:'localhost',
    port: 3305,
    username: 'root',
    password: 'estudiantes2020',
    database: 'usuarios',
    entities: [usuario],
    synchronize: true,
    }),UsuariosModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
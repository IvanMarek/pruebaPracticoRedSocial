import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module'; // Ajusta la ruta según tu estructura
import { UsuariosService } from '../usuarios/usuarios.service';// Ajusta la ruta
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto'; // Ajusta la ruta
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const usuariosService = appContext.get(UsuariosService);

    const adminUser = {
        nombre: 'Admin',
        email: 'marekivan@gmail.com',
        contraseña: 'admin123',
        activo: true,
        rol: 'admin',
    };

    // Hashear la contraseña
    adminUser.contraseña = await bcrypt.hash(adminUser.contraseña, 10);

    try {
        const existingUsers = await usuariosService.findAll();
        const userExists = existingUsers.some(user => user.email === adminUser.email);

        if (!userExists) {
            await usuariosService.create(adminUser);
            console.log('Usuario administrador creado con éxito');
        } else {
            console.log('El usuario administrador ya existe');
        }
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    } finally {
        await appContext.close();
    }
}

bootstrap().catch(error => console.error(error));
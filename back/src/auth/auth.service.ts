import { Injectable, BadRequestException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service'; // Asegúrate de que la ruta sea correcta
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../usuarios/dto/update-usuario.dto';
import { JwtService } from '@nestjs/jwt'; // Importa JwtService si lo necesitas para generar tokens

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService, // Agrega JwtService si planeas usar JWT
  ) {}

  public async register(createUsuarioDto: CreateUsuarioDto) {
    // Verifica si el usuario ya existe
    const existingUser = await this.usuariosService.findByEmail(createUsuarioDto.email);
    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario con ese E-mail');
    }

    // Crea el nuevo usuario
    return await this.usuariosService.create(createUsuarioDto);
  }

  public async login(email: string, contraseña: string) {
    // Busca el usuario
    const user = await this.usuariosService.findByEmail(email);
    if (!user) {
        throw new BadRequestException('Credenciales incorrectas: usuario no encontrado');
    }

    // Compara la contraseña
    const match = await this.usuariosService.comparePasswords(contraseña, user.contraseña);
    if (!match) {
        throw new BadRequestException('Credenciales incorrectas: contraseña no coincide');
    }

    // Genera el token
    const token = this.jwtService.sign({ userId: user.id });
    console.log("Token generado:", token); // Agrega esta línea

    return {
        statusCode: 200,
        msg: 'Inicio de sesión exitoso',
        userId: user.id,
        token, // Aquí se incluye el token
    };
}


  public async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const user = await this.usuariosService.findOne(id);
    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    // Si se proporciona una nueva contraseña, la hasheamos
    if (updateUsuarioDto.contraseña) {
      const hashedPassword = await this.usuariosService.hashPassword(updateUsuarioDto.contraseña);
      updateUsuarioDto.contraseña = hashedPassword; // Reemplazamos la contraseña por la hasheada
    }

    // Actualizamos el usuario
    return await this.usuariosService.update(id, updateUsuarioDto);
  }
}


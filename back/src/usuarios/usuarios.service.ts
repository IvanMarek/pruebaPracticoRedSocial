import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  @InjectRepository(usuario)
  private usuarioRepository: Repository<usuario>;

  public async hashPassword(contraseña: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
    return hashedPassword;
  }

  public async comparePasswords(contraseña: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(contraseña, hashedPassword);
  }

  // Método para encontrar un usuario por su email
  public async findByEmail(email: string): Promise<usuario | undefined> {
    return await this.usuarioRepository.findOne({ where: { email } });
  }

  public async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const existingUser = await this.findByEmail(createUsuarioDto.email);
      if (existingUser) {
        throw new BadRequestException('Ya existe un usuario con ese E-mail');
      }

      // Hasheamos la contraseña
      const hashedPassword = await this.hashPassword(createUsuarioDto.contraseña);

      // Guardamos el nuevo usuario
      const nuevoUsuario = this.usuarioRepository.create({
        ...createUsuarioDto,
        contraseña: hashedPassword,
        rol: createUsuarioDto.rol || 'user',
        activo: createUsuarioDto.activo ?? true,
      });

      await this.usuarioRepository.save(nuevoUsuario);
      return {
        statusCode: 200,
        msg: 'El usuario se creó correctamente',
      };
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  public async findAll(): Promise<usuario[]> {
    try {
      return await this.usuarioRepository.find();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async findOne(id: number) {
    try {
      const usuario = await this.usuarioRepository.findOneBy({ id });
      if (!usuario) {
        throw new BadRequestException("El usuario no existe");
      }
      return usuario;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const updatedUser = {
        ...updateUsuarioDto,
        rol: updateUsuarioDto.rol || 'user',
        activo: updateUsuarioDto.activo ?? true,
      };

      await this.usuarioRepository.update(id, updatedUser);
      return {
        statusCode: 201,
        msg: 'El usuario se modificó correctamente',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async remove(id: number) {
    try {
      await this.usuarioRepository.delete(id);
      return {
        statusCode: 200,
        msg: 'El usuario se eliminó correctamente',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async login(email: string, contraseña: string) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new BadRequestException('Credenciales incorrectas A');
      }

      const match = await this.comparePasswords(contraseña, user.contraseña);
      if (!match) {
        throw new BadRequestException('Credenciales incorrectas B');
      }

      return {
        statusCode: 200,
        msg: 'Inicio de sesión exitoso',
        userId: user.id, // Retorna el ID del usuario o cualquier otra información que necesites
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

import { Body, Controller, Post, Put, Param, Patch, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto'; // Importa el DTO
import { UpdateUsuarioDto } from '../usuarios/dto/update-usuario.dto'; // Importa el DTO

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return await this.authService.register(createUsuarioDto);
  }

  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return await this.authService.update(id, updateUsuarioDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; contraseña: string }) {
      const { email, contraseña } = body;
      const tokenResponse = await this.authService.login(email, contraseña);
      return tokenResponse; // Asegúrate de que esto contenga el token
  }
}
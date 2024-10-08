import { IsEmail, IsNotEmpty, isString, IsString } from "class-validator"
export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsString()
    @IsNotEmpty()
    contraseña: string

    @IsNotEmpty()
    @IsEmail()
    email: string; // Validación de correo electrónico
}

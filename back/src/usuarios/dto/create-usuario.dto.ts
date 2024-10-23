import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    contraseña: string;

    @IsNotEmpty()
    @IsEmail()
    email: string; // Validación de correo electrónico

    @IsString() // Validación para rol
    @IsNotEmpty() // Asegúrate de que el rol no esté vacío
    rol: string; // Nuevo campo para el rol


    @IsBoolean() // Validación para el estado activo
    @IsOptional() // Campo opcional, por defecto será true
    activo: boolean;
}

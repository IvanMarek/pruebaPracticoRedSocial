import { TypeOrmModule } from "@nestjs/typeorm";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  biografia: string;

  @Column({ nullable: true })
  fotoPerfil: string;

  @Column()
  contraseña: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ default: 'usuario' })
  rol: string;
}



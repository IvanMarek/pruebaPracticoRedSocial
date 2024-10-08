import { TypeOrmModule } from "@nestjs/typeorm";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity ({name: 'usuario'})

export class usuario {
    @PrimaryGeneratedColumn({type:'int',})
    id:number;

    @Column ({ type: 'varchar'})
    nombre: string;

    @Column({ type: 'varchar', unique: true }) // Nuevo campo email único
    email: string;

    @Column ({type: 'varchar'})
    contraseña: string;
}


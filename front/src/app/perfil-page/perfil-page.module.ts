import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilPageComponent } from './perfil-page.component'; // Asegúrate de que la ruta sea correcta
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PerfilPageComponent, // Declara aquí el componente de perfil
  ],
  imports: [
    CommonModule, // Módulo común para directivas como ngIf, ngFor, etc.
    RouterModule // Módulo para manejar rutas si es necesario
  ],
  exports: [
    PerfilPageComponent // Exporta el componente si lo necesitas en otros módulos
  ]
})
export class PerfilPageModule { }

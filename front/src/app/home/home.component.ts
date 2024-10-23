import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,  // Agregar standalone: true
  imports: [CommonModule],  // Puedes seguir importando CommonModule u otros módulos necesarios
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}

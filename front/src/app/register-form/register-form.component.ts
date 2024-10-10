import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NombreServicioService } from '../uso-back.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup;
  correos: string[] = [];

  constructor(private fb: FormBuilder, private service: NombreServicioService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], [this.emailExistsValidator.bind(this)]],
      username: [''],
      password: [''],
      confirmPassword: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.correos = await this.service.cargarCorreos(); // Cargar correos al inicializar el componente
      console.log('Correos cargados:', this.correos);
    } catch (error) {
      console.error('Error al cargar los correos:', error);
    }
  }

  // Validador asíncrono para verificar si el email ya existe
  emailExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return from(this.service.cargarCorreos()).pipe( // Convertir el Promise en Observable
      map((correos: any[]) => {
        const emailExists = correos.some((usuario: any) => usuario.email === control.value);
        return emailExists ? { emailExists: true } : null;
      })
    );
  }

  onSubmit() {
    const { email, password, confirmPassword, username } = this.registerForm.value;
    if (password === confirmPassword) {
      this.service.registrar({ email, nombre: username, contraseña: password }).subscribe((data) => {
        if (data && data.statusCode === 200) {
          Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(["/login"]);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al registrar',
          });
        }
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: error.message
        });
      });
    } else {
      console.log('Las contraseñas no coinciden');
    }
  }

  navegar(): void {
    this.router.navigate(["/login"]);
  }
}

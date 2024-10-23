import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NombreServicioService } from '../uso-back.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup;
  correos: string[] = [];

  constructor(private fb: FormBuilder, private service: NombreServicioService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(60)], [this.emailExistsValidator.bind(this)]],
      username: ['', [Validators.required]], // Campo usuario obligatorio
      password: ['', [Validators.required, this.passwordStrengthValidator]], // Campo contraseña obligatorio
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.correos = await this.service.cargarCorreos(); // Cargar correos al inicializar el componente
      console.log('Correos cargados:', this.correos);
    } catch (error) {
      console.error('Error al cargar los correos:', error);
    }
  }

  passwordsMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
  
    if (!password) {
      return null;
    }
  
    // Verificar si la contraseña cumple con los requisitos
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;
  
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;
  
    return !passwordValid ? { passwordStrength: true } : null;
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
    this.registerForm.markAllAsTouched();
    // Validar que todos los campos obligatorios estén completos
    if (this.registerForm.valid) {
      const { email, password, confirmPassword, username } = this.registerForm.value;

      // Verificar que las contraseñas coincidan
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
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Las contraseñas no coinciden.'
        });
        console.log('Las contraseñas no coinciden');
      }
    } else {
      // Mostrar un mensaje de error si hay campos vacíos
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Por favor complete todos los campos obligatorios.'
      });
      console.log('Los campos obligatorios no están completos');
    }
  }

  navegar(): void {
    this.router.navigate(["/login"]);
  }
}

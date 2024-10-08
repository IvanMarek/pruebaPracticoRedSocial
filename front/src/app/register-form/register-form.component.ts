import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NombreServicioService } from '../uso-back.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit{
  registerForm: FormGroup;
  correos: string[] = []

  constructor(private fb: FormBuilder, private service: NombreServicioService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailExistsValidator(this.correos)]],
      username: [''],
      password: [''],
      confirmPassword: ['']
    });

  }

  async ngOnInit(): Promise<void> {
    try {
      this.correos = await this.service.cargarCorreos(); // Llama a la función para cargar correos
      console.log('Correos cargados:', this.correos);
    } catch (error) {
      console.error('Error al cargar los correos:', error);
    }
  }

  

  emailExistsValidator(existingEmails: string[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (existingEmails.includes(email)) {
      return { emailExists: true }; // Retorna un error si el email ya existe
    }
    return null; // Retorna null si no hay error
  };
}


  onSubmit() {
    const { email,password, confirmPassword, username } = this.registerForm.value;
    if (password === confirmPassword) {
      this.service.registrar({email:email, nombre: username, contraseña: password}).subscribe((data) => {
        console.log("data: " + JSON.stringify(data))
        if(data.statusCode === 200){
          console.log("Registrado con éxito")
          Swal.fire({
            icon: 'success',
            title: '¡Inicio de sesión exitoso!',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(["/login"])
        } else {
          console.log("Error al registrar")
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al registrar',
          });
        }
      })
    } else {
      console.log('Form not valid');
    }
  }

  navegar(): void {
    this.router.navigate(["/login"])
  }
}

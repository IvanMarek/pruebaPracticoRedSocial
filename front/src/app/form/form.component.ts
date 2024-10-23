import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NombreServicioService } from '../uso-back.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html'
})
export class FormComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private service: NombreServicioService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  

  onSubmit(): void {
    if (this.loginForm.valid) {
        const formValues = this.loginForm.value;
        console.log('email:', formValues.email);
        console.log('Password:', formValues.password);

        this.service.ingresar({ email: formValues.email, contraseña: formValues.password }).subscribe((data) => {
            console.log("data: " + JSON.stringify(data));
            if (data.statusCode === 200) {
                console.log("Éxito");
                console.log("Token almacenado:", localStorage.getItem('token')); // Verifica el token en la consola
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.router.navigate(["/home"]);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Usuario o contraseña incorrectos',
                });
                this.loginForm.reset();  // Limpiar los campos del formulario si el login falla
            }
        }, (error) => {
            console.error("Error al iniciar sesión:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al iniciar sesión'
            });
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Por favor, complete todos los campos'
        });
    }
}


  navegar(): void {
    this.router.navigate(["/register"]);
  }
}

import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { HomeComponent } from './home/home.component';
import { FormularioComponent } from './formulario/formulario.component';

export const routes: Routes = [
    {path:'', redirectTo: "/login", pathMatch: "full"},
    {path:'login', component: FormComponent},
    {path:'register', component: RegisterFormComponent},
    {path:'home', component: HomeComponent},
    {path:'formulario', component: FormularioComponent},
    {path:'**', redirectTo: "/login"},

];
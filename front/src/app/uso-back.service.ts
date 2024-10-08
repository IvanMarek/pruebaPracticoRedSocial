import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
@Injectable({
providedIn: 'root'
})
export class NombreServicioService {
private apiUrl = 'http://localhost:3000/usuario'; // URL del backend de NestJS
constructor(private http: HttpClient) { }

// Método para realizar una solicitud GET
obtenerDatos(): Observable<any> {
return this.http.get<any>(`${this.apiUrl}`);
}


async cargarCorreos(): Promise<any[]> {
  // Usa firstValueFrom para convertir el Observable a una Promise
  const datos = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}`));
  
  // Mapea los datos para obtener solo los correos
  const correos = datos.map((usuario: any) => ({
    email: usuario.email
  }));

  return correos;
}


// Método para realizar una solicitud POST
ingresar(data: any): Observable<any> {
return this.http.post<any>(`${this.apiUrl}/login`, data);
}
// Método para realizar una solicitud POST de registro
registrar(data: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/register`, data);
}
}
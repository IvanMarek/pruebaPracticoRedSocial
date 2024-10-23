import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom, map } from 'rxjs';
@Injectable({
providedIn: 'root'
})
export class NombreServicioService {
private apiUrl = 'http://localhost:3000/usuario'; // URL del backend de NestJS
constructor(private http: HttpClient) { }


guardarToken(token: string): void {
  localStorage.setItem('token', token);
}

obtenerToken(): string | null {
  return localStorage.getItem('token'); // Recupera el token del local storage
}

// Método para realizar una solicitud GET
obtenerDatos(): Observable<any> {
return this.http.get<any>(`${this.apiUrl}`);
}


async cargarCorreos(): Promise<any[]> {
  try {
    // usa firstValueFrom para convertir el observable a una promise
    const datos = await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));

    // verifica si los datos no son un array (indica que puede ser un error)
    if (!Array.isArray(datos) && datos.statusCode === 400) {
      console.log(datos.msg);
      return [];  // retorna un arreglo vacío si hay un error
    }

    // si los datos son un array, se procede a mapear los correos
    const correos = datos.map((usuario: any) => ({
      email: usuario.email
    }));

    return correos;

  } catch (error) {
    console.error("Error al cargar correos:", error);
    return [];
  }
}



// Método para realizar una solicitud POST
ingresar(data: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
    map((response: any) => {
      if (response.token) {
        this.guardarToken(response.token); // Guarda el token si existe
      }
      return response;
    })
  );
}
// Método para realizar una solicitud POST de registro
registrar(data: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/register`, data);
}
}
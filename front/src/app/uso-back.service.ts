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
  try {
    // Usa firstValueFrom para convertir el Observable a una Promise
    const datos = await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));

    // Verifica si los datos no son un array (indica que puede ser un error)
    if (!Array.isArray(datos) && datos.statusCode === 400) {
      console.log(datos.msg);  // Imprime el mensaje de error en consola
      return [];  // Retorna un arreglo vacío si hay un error
    }

    // Si los datos son un array, se procede a mapear los correos
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
return this.http.post<any>(`${this.apiUrl}/login`, data);
}
// Método para realizar una solicitud POST de registro
registrar(data: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/register`, data);
}
}
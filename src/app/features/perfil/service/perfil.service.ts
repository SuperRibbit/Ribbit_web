
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { cadastroUsuario } from '../../../model/cadastroUsuario';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private http = inject(HttpClient);

  
}

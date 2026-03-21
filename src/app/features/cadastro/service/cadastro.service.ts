
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { cadastroUsuario } from '../../../model/cadastroUsuario';

@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  private http = inject(HttpClient);

  
}

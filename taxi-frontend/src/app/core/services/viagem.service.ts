import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Viagem } from '../models/viagem';

@Injectable({ providedIn: 'root' })
export class ViagemService {
  private baseUrlMotorista = 'http://localhost:3000/motorista';
  private baseUrlCliente = 'http://localhost:3000/cliente';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  // Pedir uma nova viagem
pedirViagem(viagem: any): Observable<Viagem> {
  const url = `${this.baseUrlCliente}/pedirViagem`;
  return this.http.post<Viagem>(url, viagem, this.httpOptions).pipe(
    tap((v: Viagem) => this.log(`viagem pedida com id=${v._id}`)),
    catchError(this.handleError<Viagem>('pedirViagem'))
  );
}

// Confirmar uma viagem
confirmarViagem(clienteId: string, viagemId: string): Observable<Viagem> {
  const url = `${this.baseUrlCliente}/${clienteId}/confirmar/${viagemId}`;
  return this.http.post<Viagem>(url, {}, this.httpOptions).pipe(
    tap((v: Viagem) => this.log(`viagem confirmada id=${v._id}`)),
    catchError(this.handleError<Viagem>('confirmarViagem'))
  );
}

// Rejeitar uma viagem
rejeitarViagem(clienteId: string, viagemId: string): Observable<Viagem> {
  const url = `${this.baseUrlCliente}/${clienteId}/rejeitar/${viagemId}`;
  return this.http.post<Viagem>(url, {}, this.httpOptions).pipe(
    tap((v: Viagem) => this.log(`viagem rejeitada id=${v._id}`)),
    catchError(this.handleError<Viagem>('rejeitarViagem'))
  );
}

cancelarViagem(clienteId: string, viagemId: string): Observable<Viagem> {
  const url = `${this.baseUrlCliente}/${clienteId}/cancelar/${viagemId}`;
  return this.http.post<Viagem>(url, {}, this.httpOptions).pipe(
    tap((v: Viagem) => this.log(`viagem cancelada id=${v._id}`)),
    catchError(this.handleError<Viagem>('cancelarViagem'))
  );
}


  // Obter viagens pendentes próximas para o motorista
  getViagensPendentes(motoristaId: string, lat: number, lon: number): Observable<Viagem[]> {
    const params = {
      lat: lat.toString(),
      lon: lon.toString(),
    };
    const url = `${this.baseUrlMotorista}/${motoristaId}/viagens-pendentes`;
    return this.http.get<Viagem[]>(url, { params }).pipe(
        tap((_) => this.log(`fetched pedidos pendentes do motorista ${motoristaId}`)),
        catchError(this.handleError<Viagem[]>('getPedidosPendentes', []))
    );
  }

  // Aceitar pedido de viagem
  aceitarViagem(motoristaId: string, viagemId: string, distanciaKm: number): Observable<Viagem> {
    const url = `${this.baseUrlMotorista}/${motoristaId}/aceitar-viagem/${viagemId}`;
    return this.http.post<Viagem>(url, {distanciaKm}, this.httpOptions).pipe(
      tap((_) => this.log(`Pedido aceite para viagem ${viagemId}`)),
      catchError(this.handleError<Viagem>('aceitarPedido'))
    );
  }

  inicioViagem(viagemId: string, data: any): Observable<Viagem> {
    const url = `${this.baseUrlMotorista}/detalhes/${viagemId}/start`;
    return this.http.post<Viagem>(url, data).pipe(
      tap((_) => this.log(`Pedido iniciado pelo motorista ${viagemId}`)),
      catchError(this.handleError<Viagem>('inicioViagem'))
    );
  }

  fimViagem(viagemId: string): Observable<Viagem> {
    const url = `${this.baseUrlMotorista}/detalhes/${viagemId}/end`;
    return this.http.post<Viagem>(url, {}).pipe(
      tap((_) => this.log(`Pedido terminado pelo motorista ${viagemId}`)),
      catchError(this.handleError<Viagem>('fimViagem'))
    );
  }

  getViagensByMotorista(viagemId: string): Observable<Viagem[]> {
    const url = `${this.baseUrlMotorista}/detalhes/${viagemId}/viagens`;
    return this.http.get<Viagem[]>(url).pipe(
      tap((_) => this.log(`Fetched viagens pelo motorista ${viagemId}`)),
      catchError(this.handleError<Viagem[]>('getViagensMotorista',[]))
    );
  }

  getViagemById(viagemId: string): Observable<Viagem | null> {
    const url = `${this.baseUrlCliente}/getViagem/${viagemId}`;
    return this.http.get<Viagem>(url).pipe(
      tap(() => this.log(`Fetched viagem ${viagemId}`)),
      catchError((err) => {
        console.error("Erro ao buscar viagem por ID:", err);
        return of(null); // <--- Retorna null para ser tratado no subscribe
      })
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} falhou: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`PedidoService: ${message}`);
  }
}

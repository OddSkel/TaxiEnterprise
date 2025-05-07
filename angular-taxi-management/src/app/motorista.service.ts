import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Motorista } from './motorista';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class MotoristaService {
  private motoristaUrl = 'http://localhost:3000/gestor/motoristas'; // adapta à tua API

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  // Obter todos os motoristas
  getMotoristas(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(this.motoristaUrl).pipe(
      tap((_) => this.log('fetched Motoristas')),
      catchError(this.handleError<Motorista[]>('getMotoristas', []))
    );
  }

  // Obter um motorista por ID
  getMotorista(id: string): Observable<Motorista> {
    const url = `${this.motoristaUrl}/${id}`;
    return this.http.get<Motorista>(url).pipe(
      tap((_) => this.log(`fetched Taxi id=${id}`)),
      catchError(this.handleError<Motorista>(`getMotorista id=${id}`))
    );
  }

  // Obter um motorista por ID
  getMotoristaByNIF(nif: string): Observable<Motorista> {
    const url = `${this.motoristaUrl}/nif/${nif}`;
    return this.http.get<Motorista>(url).pipe(
      tap((_) => this.log(`fetched Taxi nif=${nif}`)),
      catchError(this.handleError<Motorista>(`getMotorista nif=${nif}`))
    );
  }

  /* GET Motoristas whose name contains search term */
  searchMotoristas(term: string): Observable<Motorista[]> {
    if (!term.trim()) {
      // If no search term, fetch all motoristas
      return this.http.get<Motorista[]>(`${this.motoristaUrl}`); // Update this with the actual route for all motoristas
    }
    return this.http
      .get<Motorista[]>(`${this.motoristaUrl}/search?nif=${term}`)
      .pipe(
        tap((x) =>
          x.length
            ? this.log(`found Motoristas matching "${term}"`)
            : this.log(`no Motoristas matching "${term}"`)
        ),
        catchError(this.handleError<Motorista[]>('searchMotoristas', []))
      );
  }

  // Criar um novo motorista
  addMotorista(motorista: Motorista): Observable<Motorista> {
    return this.http.post<Motorista>(this.motoristaUrl, motorista).pipe(
      map((response: any) => {
        return {
          ...response,
          id: response._id, // map _id from Mongo to id in your interface
        };
      }),
      catchError(this.handleError<Motorista>('addMotorista'))
    );
  }

  // Atualizar um motorista
  updateMotorista(motorista: Motorista): Observable<any> {
    return this.http
      .put(`${this.motoristaUrl}/${motorista._id}`, motorista)
      .pipe(
        tap((_) => this.log(`updated Motorista =${motorista}`)),
        catchError(this.handleError<any>('updateTaxi'))
      );
  }

  // Remover um motorista
  deleteMotorista(id: string): Observable<any> {
    const url = `${this.motoristaUrl}/${id}`;
    return this.http.delete<Motorista>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted Motorista id=${id}`)),
      catchError(this.handleError<Motorista>('deleteMotorista'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a TaxiService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`MotoristaService: ${message}`);
  }
}

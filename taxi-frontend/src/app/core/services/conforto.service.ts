import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Conforto } from '../models/conforto';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ConfortoService {
  private confortoUrl = 'http://localhost:3000/gestor/conforto'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getConfortos(): Observable<Conforto[]> {
    return this.http.get<Conforto[]>(this.confortoUrl).pipe(
      tap((_) => this.log('fetched Confortos')),
      catchError(this.handleError<Conforto[]>('getConfortos', []))
    );
  }

  getConforto(id: String): Observable<Conforto> {
    const url = `${this.confortoUrl}/${id}`;
    return this.http.get<Conforto>(url).pipe(
      tap(_ => this.log(`fetched conforto id=${id}`)),
      catchError(this.handleError<Conforto>(`getConforto id=${id}`))
    )
  }

  updateConforto(conforto: Conforto): Observable<any> {
    return this.http.put(`${this.confortoUrl}/${conforto.name}`, conforto).pipe(
      tap(_ => this.log(`updated conforto id=${conforto.name}`)),
      catchError(this.handleError<any>('updateConforto'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`ConfortoService: ${message}`);
  }
}

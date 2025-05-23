import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Turno } from '../models/turno';
import { Taxi } from '../models/taxi';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private turnoUrl = 'http://0.0.0.0:3063/motorista/turnos/motoristas';
  private gestorUrl = 'http://0.0.0.0:3063/gestor/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getAvailableTaxisForShift(
    driverId: string,
    start: string,
    end: string
  ): Observable<Taxi[]> {
    const params = new HttpParams().set('start', start).set('end', end);

    return this.http
      .get<{ availableTaxis: Taxi[] }>(`${this.turnoUrl}/${driverId}/turno`, {
        params,
      })
      .pipe(map((res) => res.availableTaxis));
  }

  requestTaxiForShift(
    driverId: string,
    periodo: { start: string; end: string },
    taxi: { matricula: string }
  ): Observable<Turno[]> {
    return this.http
      .post<{ message: string; allShifts: Turno[] }>(
        `${this.turnoUrl}/${driverId}/`,
        { periodo, taxi },
        this.httpOptions
      )
      .pipe(
        map((response: any) => {
          return response.allShifts;
        }),
        catchError(this.handleError<Turno[]>('requestTaxiForShift'))
      );
  }

  getAllShifts(driverId: string): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.turnoUrl}/${driverId}/`).pipe(
      map((shifts) =>
        shifts.map((shift) => ({
          ...shift,
          periodo: {
            start: shift.start,
            end: shift.end,
          },
        }))
      )
    );
  }

  getAllTaxiShifts(taxiId: string): Observable<Turno[]> {
    return this.http
      .get<Turno[]>(`${this.gestorUrl}/taxi/${taxiId}/turnos`)
      .pipe(
        map((shifts) =>
          shifts.map((shift) => ({
            ...shift,
            periodo: {
              start: shift.start,
              end: shift.end,
            },
          }))
        )
      );
  }

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
    this.messageService.add(`TaxiService: ${message}`);
  }
}

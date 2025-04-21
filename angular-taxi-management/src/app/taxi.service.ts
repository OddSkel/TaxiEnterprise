import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Taxi } from './taxi';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class TaxiService {
  private taxisUrl = 'http://localhost:3000/gestor/taxis'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /** GET Taxies from the server */
  getTaxis(): Observable<Taxi[]> {
    return this.http.get<Taxi[]>(this.taxisUrl).pipe(
      tap((_) => this.log('fetched Taxis')),
      catchError(this.handleError<Taxi[]>('getTaxis', []))
    );
  }

  /** GET Taxi by id. Return `undefined` when id not found */
  getTaxiNo404<Data>(id: number): Observable<Taxi> {
    const url = `${this.taxisUrl}/?id=${id}`;
    return this.http.get<Taxi[]>(url).pipe(
      map((Taxies) => Taxies[0]), // returns a {0|1} element array
      tap((h) => {
        const outcome = h ? 'fetched' : 'did not find';
        this.log(`${outcome} Taxi id=${id}`);
      }),
      catchError(this.handleError<Taxi>(`getTaxi id=${id}`))
    );
  }

  /** GET Taxi by id. Will 404 if id not found */
  getTaxi(id: string): Observable<Taxi> {
    const url = `${this.taxisUrl}/${id}`;
    return this.http.get<Taxi>(url).pipe(
      tap((_) => this.log(`fetched Taxi id=${id}`)),
      catchError(this.handleError<Taxi>(`getTaxi id=${id}`))
    );
  }

  /* GET Taxies whose name contains search term */
  searchTaxis(term: string): Observable<Taxi[]> {
    if (!term.trim()) {
      // if not search term, return empty Taxi array.
      return of([]);
    }
    return this.http.get<Taxi[]>(`${this.taxisUrl}/?matricula=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found Taxies matching "${term}"`)
          : this.log(`no Taxies matching "${term}"`)
      ),
      catchError(this.handleError<Taxi[]>('searchTaxis', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new Taxi to the server */
  addTaxi(taxi: Taxi): Observable<Taxi> {
    return this.http.post<Taxi>(this.taxisUrl, taxi).pipe(
      map((response: any) => {
        return {
          ...response,
          id: response._id, // map _id from Mongo to id in your interface
        };
      }),
      catchError(this.handleError<Taxi>('addTaxi'))
    );
  }

  /** DELETE: delete the Taxi from the server */
  deleteTaxi(id: string): Observable<Taxi> {
    const url = `${this.taxisUrl}/${id}`;

    return this.http.delete<Taxi>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted Taxi id=${id}`)),
      catchError(this.handleError<Taxi>('deleteTaxi'))
    );
  }

  /** PUT: update the Taxi on the server */
  updateTaxi(Taxi: Taxi): Observable<any> {
    return this.http.put(`${this.taxisUrl}/${Taxi._id}`, Taxi).pipe(
      tap((_) => this.log(`updated Taxi matricula=${Taxi.matricula}`)),
      catchError(this.handleError<any>('updateTaxi'))
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
    this.messageService.add(`TaxiService: ${message}`);
  }
}

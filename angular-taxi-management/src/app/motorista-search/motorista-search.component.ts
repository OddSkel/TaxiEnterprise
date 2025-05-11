import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Router } from '@angular/router';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';

import { Motorista } from '../motorista';
import { MotoristaService } from '../motorista.service';

@Component({
  selector: 'app-motorista-search',
  templateUrl: './motorista-search.component.html',
  styleUrls: ['./motorista-search.component.css'],
})
export class MotoristaSearchComponent implements OnInit {
  motoristas$!: Observable<Motorista[]>;
  private searchTerms = new Subject<string>();
  notFound = false;

  constructor(
    private MotoristaService: MotoristaService,
    private router: Router
  ) {}

  search(term: string): void {
    if (term && !/^\d+$/.test(term)) {
      alert('Por favor insira apenas números no NIF.');
      return;
    }
    const nif = parseInt(term, 10);

    if (term.length > 9) {
      alert('O nif só pode ter 9 dígitos');
      return;
    }
    if (term.trim()) {
      this.searchTerms.next(term);
    } else {
      this.searchTerms.next('');
    }
  }

  onSearchBoxFocus(): void {
    // Fetch all motoristas when the input box is focused (clicked on)
    this.searchTerms.next('');
  }

  ngOnInit(): void {
    this.motoristas$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) =>
        this.MotoristaService.searchMotoristas(term).pipe(
          tap((motoristas) => {
            this.notFound = motoristas.length === 0;
          })
        )
      )
    );
  }

  goToMotoristaDetails(motorista: Motorista): void {
    this.router.navigate(['motorista/turnos/motoristas', motorista._id]);
  }
}

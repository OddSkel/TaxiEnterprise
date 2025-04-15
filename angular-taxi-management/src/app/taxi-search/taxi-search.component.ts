import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Taxi } from '../taxi';
import { TaxiService } from '../taxi.service';

@Component({
  selector: 'app-taxi-search',
  templateUrl: './taxi-search.component.html',
  styleUrls: ['./taxi-search.component.css'],
})
export class TaxiSearchComponent implements OnInit {
  taxis$!: Observable<Taxi[]>;
  private searchTerms = new Subject<string>();

  constructor(private TaxiService: TaxiService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.taxis$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.TaxiService.searchTaxis(term))
    );
  }
}

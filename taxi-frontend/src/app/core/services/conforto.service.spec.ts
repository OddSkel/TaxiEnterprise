import { TestBed } from '@angular/core/testing';

import { ConfortoService } from './conforto.service';

describe('ConfortoService', () => {
  let service: ConfortoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfortoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Iban } from './iban';

describe('Iban', () => {
  let service: Iban;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Iban);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

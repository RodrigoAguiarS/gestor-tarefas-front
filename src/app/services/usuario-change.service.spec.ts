import { TestBed } from '@angular/core/testing';

import { UsuarioChangeService } from './usuario-change.service';

describe('UsuarioChangeService', () => {
  let service: UsuarioChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { HistoricoStatusVendaService } from './historico-status-venda.service';

describe('HistoricoStatusVendaService', () => {
  let service: HistoricoStatusVendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricoStatusVendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

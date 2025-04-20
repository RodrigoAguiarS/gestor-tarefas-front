import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoDeleteComponent } from './pagamento-delete.component';

describe('PagamentoDeleteComponent', () => {
  let component: PagamentoDeleteComponent;
  let fixture: ComponentFixture<PagamentoDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagamentoDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

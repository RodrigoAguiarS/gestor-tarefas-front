import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoCreateComponent } from './pagamento-create.component';

describe('PagamentoCreateComponent', () => {
  let component: PagamentoCreateComponent;
  let fixture: ComponentFixture<PagamentoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagamentoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

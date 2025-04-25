import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaFinalizarComponent } from './venda-finalizar.component';

describe('VendaFinalizarComponent', () => {
  let component: VendaFinalizarComponent;
  let fixture: ComponentFixture<VendaFinalizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaFinalizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaFinalizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

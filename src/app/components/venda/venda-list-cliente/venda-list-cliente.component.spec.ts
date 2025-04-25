import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaListClienteComponent } from './venda-list-cliente.component';

describe('VendaListClienteComponent', () => {
  let component: VendaListClienteComponent;
  let fixture: ComponentFixture<VendaListClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaListClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaListClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

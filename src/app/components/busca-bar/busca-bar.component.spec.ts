import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaBarComponent } from './busca-bar.component';

describe('BuscaBarComponent', () => {
  let component: BuscaBarComponent;
  let fixture: ComponentFixture<BuscaBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscaBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

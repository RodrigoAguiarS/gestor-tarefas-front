import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilCreateComponent } from './perfil-create.component';

describe('PerfilCreateComponent', () => {
  let component: PerfilCreateComponent;
  let fixture: ComponentFixture<PerfilCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

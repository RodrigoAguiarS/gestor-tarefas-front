import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioDeleteComponent } from './usuario-delete.component';

describe('UsuarioDeleteComponent', () => {
  let component: UsuarioDeleteComponent;
  let fixture: ComponentFixture<UsuarioDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

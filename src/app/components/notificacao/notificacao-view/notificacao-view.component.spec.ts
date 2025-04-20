import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacaoViewComponent } from './notificacao-view.component';

describe('NotificacaoViewComponent', () => {
  let component: NotificacaoViewComponent;
  let fixture: ComponentFixture<NotificacaoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacaoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

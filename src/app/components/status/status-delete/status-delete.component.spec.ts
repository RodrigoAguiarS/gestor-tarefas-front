import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDeleteComponent } from './status-delete.component';

describe('StatusDeleteComponent', () => {
  let component: StatusDeleteComponent;
  let fixture: ComponentFixture<StatusDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

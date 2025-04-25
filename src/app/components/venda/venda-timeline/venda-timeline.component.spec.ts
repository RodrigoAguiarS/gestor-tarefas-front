import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaTimelineComponent } from './venda-timeline.component';

describe('VendaTimelineComponent', () => {
  let component: VendaTimelineComponent;
  let fixture: ComponentFixture<VendaTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

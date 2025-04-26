import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCheckoutComponent } from './event-checkout.component';

describe('EventCheckoutComponent', () => {
  let component: EventCheckoutComponent;
  let fixture: ComponentFixture<EventCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

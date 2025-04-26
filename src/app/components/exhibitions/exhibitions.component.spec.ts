import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitionsComponent } from './exhibitions.component';

describe('ExhibitionsComponent', () => {
  let component: ExhibitionsComponent;
  let fixture: ComponentFixture<ExhibitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExhibitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

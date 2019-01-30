import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePayoffComponent } from './create-payoff.component';

describe('CreatePayoffComponent', () => {
  let component: CreatePayoffComponent;
  let fixture: ComponentFixture<CreatePayoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePayoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePayoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

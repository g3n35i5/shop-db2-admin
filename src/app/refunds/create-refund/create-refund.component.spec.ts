import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRefundComponent } from './create-refund.component';

describe('CreateRefundComponent', () => {
  let component: CreateRefundComponent;
  let fixture: ComponentFixture<CreateRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

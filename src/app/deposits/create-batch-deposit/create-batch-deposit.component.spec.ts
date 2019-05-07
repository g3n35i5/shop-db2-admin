import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchDepositComponent } from './create-batch-deposit.component';

describe('CreateBatchDepositComponent', () => {
  let component: CreateBatchDepositComponent;
  let fixture: ComponentFixture<CreateBatchDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBatchDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

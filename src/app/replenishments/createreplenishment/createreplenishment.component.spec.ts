import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatereplenishmentComponent } from './createreplenishment.component';

describe('CreatereplenishmentComponent', () => {
  let component: CreatereplenishmentComponent;
  let fixture: ComponentFixture<CreatereplenishmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatereplenishmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatereplenishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

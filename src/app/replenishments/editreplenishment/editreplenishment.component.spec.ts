import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditreplenishmentComponent } from './editreplenishment.component';

describe('EditreplenishmentComponent', () => {
  let component: EditreplenishmentComponent;
  let fixture: ComponentFixture<EditreplenishmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditreplenishmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditreplenishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

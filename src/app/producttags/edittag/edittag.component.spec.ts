import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdittagComponent } from './edittag.component';

describe('EdittagComponent', () => {
  let component: EdittagComponent;
  let fixture: ComponentFixture<EdittagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdittagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdittagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

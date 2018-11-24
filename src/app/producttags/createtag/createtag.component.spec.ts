import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatetagComponent } from './createtag.component';

describe('CreatetagComponent', () => {
  let component: CreatetagComponent;
  let fixture: ComponentFixture<CreatetagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatetagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatetagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

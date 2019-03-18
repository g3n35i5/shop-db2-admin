import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatestocktakingcollectionComponent } from './createstocktakingcollection.component';

describe('CreatestocktakingcollectionComponent', () => {
  let component: CreatestocktakingcollectionComponent;
  let fixture: ComponentFixture<CreatestocktakingcollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatestocktakingcollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatestocktakingcollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

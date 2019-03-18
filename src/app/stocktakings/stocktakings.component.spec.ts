import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocktakingsComponent } from './stocktakings.component';

describe('StocktakingsComponent', () => {
  let component: StocktakingsComponent;
  let fixture: ComponentFixture<StocktakingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocktakingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocktakingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

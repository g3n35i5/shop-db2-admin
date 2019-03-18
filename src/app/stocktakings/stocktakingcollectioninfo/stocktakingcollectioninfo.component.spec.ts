import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocktakingcollectioninfoComponent } from './stocktakingcollectioninfo.component';

describe('StocktakingcollectioninfoComponent', () => {
  let component: StocktakingcollectioninfoComponent;
  let fixture: ComponentFixture<StocktakingcollectioninfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocktakingcollectioninfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocktakingcollectioninfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

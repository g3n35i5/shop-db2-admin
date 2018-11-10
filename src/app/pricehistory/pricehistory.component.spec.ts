import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricehistoryComponent } from './pricehistory.component';

describe('PricehistoryComponent', () => {
  let component: PricehistoryComponent;
  let fixture: ComponentFixture<PricehistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricehistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

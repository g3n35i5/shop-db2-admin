import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplenishmentcollectioninfoComponent } from './replenishmentcollectioninfo.component';

describe('ReplenishmentcollectioninfoComponent', () => {
  let component: ReplenishmentcollectioninfoComponent;
  let fixture: ComponentFixture<ReplenishmentcollectioninfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplenishmentcollectioninfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplenishmentcollectioninfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

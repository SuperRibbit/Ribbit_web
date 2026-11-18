import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Logon } from './logon';

describe('Logon', () => {
  let component: Logon;
  let fixture: ComponentFixture<Logon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logon],
    }).compileComponents();

    fixture = TestBed.createComponent(Logon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

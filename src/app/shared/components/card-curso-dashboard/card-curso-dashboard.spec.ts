import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCursoDashboard } from './card-curso-dashboard';

describe('CardCursoDashboard', () => {
  let component: CardCursoDashboard;
  let fixture: ComponentFixture<CardCursoDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCursoDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(CardCursoDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCursoHome } from './card-curso-home';

describe('CardCursoHome', () => {
  let component: CardCursoHome;
  let fixture: ComponentFixture<CardCursoHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCursoHome],
    }).compileComponents();

    fixture = TestBed.createComponent(CardCursoHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

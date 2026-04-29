import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCourse } from './player-course';

describe('PlayerCourse', () => {
  let component: PlayerCourse;
  let fixture: ComponentFixture<PlayerCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerCourse],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

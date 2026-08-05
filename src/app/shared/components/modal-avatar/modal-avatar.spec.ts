import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAvatar } from './modal-avatar';

describe('ModalAvatar', () => {
  let component: ModalAvatar;
  let fixture: ComponentFixture<ModalAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAvatar],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAvatar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

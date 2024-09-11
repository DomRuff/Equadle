import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquadleGameComponent } from './equadle-game.component';

describe('EquadleGameComponent', () => {
  let component: EquadleGameComponent;
  let fixture: ComponentFixture<EquadleGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquadleGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquadleGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

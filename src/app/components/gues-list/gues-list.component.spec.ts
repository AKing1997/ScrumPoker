import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuesListComponent } from './gues-list.component';

describe('GuesListComponent', () => {
  let component: GuesListComponent;
  let fixture: ComponentFixture<GuesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

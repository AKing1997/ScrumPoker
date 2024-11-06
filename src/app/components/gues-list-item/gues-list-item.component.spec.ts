import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuesListItemComponent } from './gues-list-item.component';

describe('GuesListItemComponent', () => {
  let component: GuesListItemComponent;
  let fixture: ComponentFixture<GuesListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuesListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

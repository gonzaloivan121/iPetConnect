import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarkerComponent } from './edit-marker.component';

describe('EditMarkerComponent', () => {
  let component: EditMarkerComponent;
  let fixture: ComponentFixture<EditMarkerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMarkerComponent]
    });
    fixture = TestBed.createComponent(EditMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

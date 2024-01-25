import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMarkerComponent } from './create-marker.component';

describe('CreateMarkerComponent', () => {
  let component: CreateMarkerComponent;
  let fixture: ComponentFixture<CreateMarkerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMarkerComponent]
    });
    fixture = TestBed.createComponent(CreateMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetProfileThumbnailComponent } from './pet-profile-thumbnail.component';

describe('PetProfileThumbnailComponent', () => {
  let component: PetProfileThumbnailComponent;
  let fixture: ComponentFixture<PetProfileThumbnailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetProfileThumbnailComponent]
    });
    fixture = TestBed.createComponent(PetProfileThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

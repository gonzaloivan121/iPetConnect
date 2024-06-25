import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetPostProfileComponent } from './pet-post-profile.component';

describe('PetPostProfileComponent', () => {
  let component: PetPostProfileComponent;
  let fixture: ComponentFixture<PetPostProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetPostProfileComponent]
    });
    fixture = TestBed.createComponent(PetPostProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

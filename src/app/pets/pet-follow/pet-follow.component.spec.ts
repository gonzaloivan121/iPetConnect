import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFollowComponent } from './pet-follow.component';

describe('PetFollowComponent', () => {
  let component: PetFollowComponent;
  let fixture: ComponentFixture<PetFollowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetFollowComponent]
    });
    fixture = TestBed.createComponent(PetFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

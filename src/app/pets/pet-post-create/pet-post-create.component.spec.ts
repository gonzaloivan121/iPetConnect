import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetPostCreateComponent } from './pet-post-create.component';

describe('PetPostCreateComponent', () => {
  let component: PetPostCreateComponent;
  let fixture: ComponentFixture<PetPostCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetPostCreateComponent]
    });
    fixture = TestBed.createComponent(PetPostCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetPostCommentComponent } from './pet-post-comment.component';

describe('PetPostCommentComponent', () => {
  let component: PetPostCommentComponent;
  let fixture: ComponentFixture<PetPostCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetPostCommentComponent]
    });
    fixture = TestBed.createComponent(PetPostCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

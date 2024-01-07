import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedStoryComponent } from './related-story.component';

describe('RelatedStoryComponent', () => {
  let component: RelatedStoryComponent;
  let fixture: ComponentFixture<RelatedStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedStoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

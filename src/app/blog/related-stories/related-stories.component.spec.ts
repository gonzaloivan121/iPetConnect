import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedStoriesComponent } from './related-stories.component';

describe('RelatedStoriesComponent', () => {
  let component: RelatedStoriesComponent;
  let fixture: ComponentFixture<RelatedStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedStoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

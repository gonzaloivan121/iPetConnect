import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestBlogpostsComponent } from './latest-blogposts.component';

describe('LatestBlogpostsComponent', () => {
  let component: LatestBlogpostsComponent;
  let fixture: ComponentFixture<LatestBlogpostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestBlogpostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestBlogpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

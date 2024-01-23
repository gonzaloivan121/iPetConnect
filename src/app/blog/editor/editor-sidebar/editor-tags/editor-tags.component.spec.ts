import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTagsComponent } from './editor-tags.component';

describe('EditorTagsComponent', () => {
  let component: EditorTagsComponent;
  let fixture: ComponentFixture<EditorTagsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorTagsComponent]
    });
    fixture = TestBed.createComponent(EditorTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

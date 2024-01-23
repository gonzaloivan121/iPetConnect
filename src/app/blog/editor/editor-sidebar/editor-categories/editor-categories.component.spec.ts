import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorCategoriesComponent } from './editor-categories.component';

describe('EditorCategoriesComponent', () => {
  let component: EditorCategoriesComponent;
  let fixture: ComponentFixture<EditorCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorCategoriesComponent]
    });
    fixture = TestBed.createComponent(EditorCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

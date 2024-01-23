import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSidebarComponent } from './editor-sidebar.component';

describe('EditorSidebarComponent', () => {
  let component: EditorSidebarComponent;
  let fixture: ComponentFixture<EditorSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorSidebarComponent]
    });
    fixture = TestBed.createComponent(EditorSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

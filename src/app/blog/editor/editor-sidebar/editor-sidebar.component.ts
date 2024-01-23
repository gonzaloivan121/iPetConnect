import { Component, EventEmitter, Output } from "@angular/core";
import { IBlogCategory, IBlogTag } from "src/app/interfaces";

@Component({
    selector: "app-editor-sidebar",
    templateUrl: "./editor-sidebar.component.html",
    styleUrls: ["./editor-sidebar.component.css"],
})
export class EditorSidebarComponent {
    @Output() categorySelectedEvent = new EventEmitter<IBlogCategory>();
    @Output() tagAddedEvent = new EventEmitter<IBlogTag>();
    @Output() tagRemovedEvent = new EventEmitter<IBlogTag>();
    @Output() descriptionChangedEvent = new EventEmitter<string>();

    selectCategory(category: IBlogCategory) {
        this.categorySelectedEvent.emit(category);
    }

    addTag(tag: IBlogTag) {
        this.tagAddedEvent.emit(tag);
    }

    removeTag(tag: IBlogTag) {
        this.tagRemovedEvent.emit(tag);
    }

    updateDescription(el: HTMLTextAreaElement) {
        this.descriptionChangedEvent.emit(el.value);
    }
}

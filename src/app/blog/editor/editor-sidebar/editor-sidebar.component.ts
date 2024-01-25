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
    @Output() imageChangedEvent = new EventEmitter<string>();

    image: string = "";

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

    updateImage(image: string) {
        this.imageChangedEvent.emit(image);
    }

    clearImage(): void {
        this.image = "";
    }

    onFileSelected(files: FileList): void {
        console.log(files)
        if (files.length <= 0) return;

        const file: File | null = files.item(0);

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            this.image = e.target.result.toString();
            this.imageChangedEvent.emit(this.image);
        };

        reader.readAsDataURL(file);
    }
}

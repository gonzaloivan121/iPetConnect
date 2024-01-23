import { Component, ElementRef, Output, OnInit, ViewChild, EventEmitter } from "@angular/core";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, from, of } from "rxjs";
import { catchError, debounceTime, map } from "rxjs/operators";
import { IBlogTag } from "src/app/interfaces";
import { AlertService, DataService, TranslateService } from "src/app/services";
import { DBTables } from "src/classes";

@Component({
    selector: "app-editor-tags",
    templateUrl: "./editor-tags.component.html",
    styleUrls: ["./editor-tags.component.css"],
})
export class EditorTagsComponent implements OnInit {
    public tags: IBlogTag[] = [];
    public tagsLoaded: Observable<boolean>;

    public selectedTags: IBlogTag[] = [];

    isFocused: boolean = false;

    @Output() tagAddedEvent = new EventEmitter<IBlogTag>();
    @Output() tagRemovedEvent = new EventEmitter<IBlogTag>();

    @ViewChild("tagInput", { static: true }) tagInput: ElementRef;

    constructor(
        private dataService: DataService,
        private alertService: AlertService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.tagsLoaded = this.getTags();
    }

    getTags(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.BlogTag)
                .then((response: any) => {
                    if (response.success) {
                        this.tags = response.result as IBlogTag[];
                    } else {
                        this.alertService.openWarning(response.message);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.alertService.openDanger("There has been an error!");
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    addTag(tagEvent: NgbTypeaheadSelectItemEvent<IBlogTag>) {
        this.selectedTags.push(Object.assign({}, tagEvent.item));
        this.tags.splice(this.tags.indexOf(tagEvent.item), 1);

        this.tagAddedEvent.emit(tagEvent.item);
    }

    removeTag(tag: IBlogTag) {
        this.tags.push(Object.assign({}, tag));
        this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);

        this.tagRemovedEvent.emit(tag);
    }

    search: OperatorFunction<string, readonly IBlogTag[]> = (
        text$: Observable<string>
    ) =>
        text$.pipe(
            debounceTime(200),
            map((tagNameStr) =>
                tagNameStr === ""
                    ? []
                    : this.tags
                          .filter(
                              (tag) =>
                                  this.translateService
                                      .get(tag.name)
                                      .toLowerCase()
                                      .indexOf(tagNameStr.toLowerCase()) > -1
                          )
                          .slice(0, 10)
            )
        );

    formatter = (tag: IBlogTag) => this.translateService.get(tag.name);
}

import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IBlogCategory } from "src/app/interfaces";
import { AlertService, DataService } from "src/app/services";
import { DBTables } from "src/classes";

@Component({
    selector: "app-editor-categories",
    templateUrl: "./editor-categories.component.html",
    styleUrls: ["./editor-categories.component.css"],
})
export class EditorCategoriesComponent implements OnInit {
    public categories: IBlogCategory[] = [];
    public categoriesLoaded: Observable<boolean>;

    @Output() categorySelectedEvent = new EventEmitter<IBlogCategory>();

    constructor(
        private dataService: DataService,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {
        this.categoriesLoaded = this.getCategories();
    }

    getCategories(): Observable<boolean> {
        return from(
            this.dataService
                .get(DBTables.BlogCategory)
                .then((response: any) => {
                    console.log(response);
                    if (response.success) {
                        this.categories = response.result as IBlogCategory[];
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

    selectCategory(category: IBlogCategory) {
        this.categorySelectedEvent.emit(category);
    }
}

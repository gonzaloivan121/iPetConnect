import { Component, OnInit } from "@angular/core";
import { IBlogCategory } from "src/app/interfaces";
import { DataService } from "src/app/services";
import { DBTables } from "src/classes";

@Component({
    selector: "app-categories",
    templateUrl: "./categories.component.html",
    styleUrls: ["./categories.component.css"],
})
export class CategoriesComponent implements OnInit {

    public categories: IBlogCategory[];

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.dataService.get(DBTables.BlogCategory + "/popularity/latest/3").then((response: any) => {
            if (response.success) {
                this.categories = response.result as IBlogCategory[];
            }
        });
    }
}

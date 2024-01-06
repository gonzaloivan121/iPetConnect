import { Pipe, PipeTransform } from "@angular/core";
import { DataService } from "src/app/services";
import { DBTables } from "src/classes";
import { IBlogCategory } from "../interfaces";

@Pipe({
    name: "blogCategory",
})
export class BlogCategoryPipe implements PipeTransform {
    constructor(private dataService: DataService) {}

    transform(id: number): Promise<string> {
        return this.dataService.get(DBTables.BlogCategory, id).then((response: any) => {
            if (response.success) {
                if (response.result.length > 0) {
                    const category: IBlogCategory = response.result[0];
                    return category.name || id.toString();
                }
            }
        });
    }
}

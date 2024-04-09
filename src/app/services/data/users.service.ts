import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DBTables } from 'src/classes';

@Injectable({
    providedIn: "root",
})
export class UsersService {
    constructor(private dataService: DataService) {}

    get(id?: number) {
        return this.dataService.get(DBTables.User, id);
    }

    getByUsername(username: string) {
        return this.dataService.getFromText(DBTables.User, "username", username);
    }

    insert(data: any) {
        return this.dataService.insert(DBTables.User, data);
    }

    update(data: any) {
        return this.dataService.update(DBTables.User, data);
    }

    delete(data: any) {
        return this.dataService.delete(DBTables.User, data);
    }
}

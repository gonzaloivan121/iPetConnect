import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { from, Observable } from 'rxjs';
import { IChat } from 'src/app/interfaces';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-admin-chats",
    templateUrl: "./chats.component.html",
    styleUrls: ["./chats.component.css"],
})
export class AdminChatsComponent implements OnInit {
    public chats: IChat[];
    public allChats: IChat[];

    public hasLoaded: Observable<boolean>;

    public searchText = "";
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const promise = this.dataService.get(DBTables.Chat).then((response: any) => {
            if (response.success) {
                this.chats = response.result as IChat[];
                this.allChats = response.result as IChat[];
                this.collectionSize = this.allChats.length;
                this.refresh();

                return true;
            } else {
                return false;
            }
        });

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.chats = this.allChats
            .map((chat, i) => ({ id: i + 1, ...chat }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize
            ) as IChat[];
    }
}

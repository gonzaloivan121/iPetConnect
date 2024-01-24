import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services';
import { from, Observable } from 'rxjs';
import { IMessage } from 'src/app/interfaces';
import { DBTables } from 'src/classes';

@Component({
    selector: "app-admin-messages",
    templateUrl: "./messages.component.html",
    styleUrls: ["./messages.component.css"],
})
export class AdminMessagesComponent implements OnInit {
    public messages: IMessage[];
    public allMessages: IMessage[];

    public hasLoaded: Observable<boolean>;

    public searchText = "";
    public page: number = 1;
    public pageSize: number = 10;
    public collectionSize: number;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const promise = this.dataService
            .get(DBTables.Message)
            .then((response: any) => {
                if (response.success) {
                    this.messages = response.result as IMessage[];
                    this.allMessages = response.result as IMessage[];
                    this.collectionSize = this.allMessages.length;
                    this.refresh();

                    return true;
                } else {
                    return false;
                }
            });

        this.hasLoaded = from(promise);
    }

    refresh() {
        this.messages = this.allMessages
            .map((chat, i) => ({ id: i + 1, ...chat }))
            .slice(
                (this.page - 1) * this.pageSize,
                (this.page - 1) * this.pageSize + this.pageSize
            ) as IMessage[];
    }
}

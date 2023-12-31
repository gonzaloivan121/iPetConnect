import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User, Like } from 'src/classes';
import { DataService, SessionService } from 'src/app/services';

@Component({
    selector: 'app-likes',
    templateUrl: './likes.component.html',
    styleUrls: ['./likes.component.css']
})
export class LikesComponent implements OnInit {
    @Input() like: Like;
    @Input() currentUser: User;
    otherUser: User;

    //@Output() likeEvent = new EventEmitter<User>();
    //@Output() dislikeEvent = new EventEmitter<User>();

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.dataService.get('user', this.like.user1_id == this.currentUser.id ? this.like.user2_id : this.like.user1_id).then((response: any) => {
            if (response.status === 'success') {
                this.otherUser = response.results[0] as User;
            }
        });
    }
}

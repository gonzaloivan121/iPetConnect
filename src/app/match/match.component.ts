import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SessionService, DataService } from '../services';
import { User, Chat, Message, Match, Like } from '../../classes';
import { RoleEnum, MatchTabEnum, LikesTabEnum } from '../enums/enums';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {
    public user: User;

    public users: User[] = [];
    public chats: Chat[] = [];
    public matches: Match[] = [];
    public likesReceived: Like[] = [];
    public likesGiven: Like[] = [];

    public activeTab: MatchTabEnum = MatchTabEnum.Messages;
    public activeSubTab: LikesTabEnum = LikesTabEnum.Received;

    public get matchTabEnum(): typeof MatchTabEnum {
        return MatchTabEnum;
    }

    public get likesTabEnum(): typeof LikesTabEnum {
        return LikesTabEnum;
    }

    constructor(
        public location: Location,
        private sessionService: SessionService,
        private dataService: DataService
    ) { }

    ngOnInit(): void {
        if (this.sessionService.get('user') !== null) {
            this.user = JSON.parse(this.sessionService.get('user'));

            if (this.user.role_id == RoleEnum.Admin) {
                this.location.back();
            }
            
            this.dataService.getExcluding('user', this.user.id).then((response: any) => {
                if (response.status === 'success') {
                    this.users = response.results;
                }
            });

            this.dataService.getFrom('match', 'user', this.user.id).then((response: any) => {
                if (response.status === 'success') {
                    this.matches = response.results;
                }
            });
        } else {
            this.location.back();
        }
    }

    changeTab(tab: MatchTabEnum) {
        this.activeTab = tab;
    }

    changeSubTab(tab: LikesTabEnum) {
        this.activeSubTab = tab;
    }

    updateMessages() {

    }

    updateMatches() {

    }

    like(user: User) {
        const likeData = {
            user1_id: this.user.id,
            user2_id: user.id
        };

        console.log(likeData)

        /*this.dataService.insert('like', likeData).then((response: any) => {
            console.log('Response', response);

            if (response.status === 'success') {

            }
        });*/
    }

    dislike(user: User) {
        const dislikeData = {
            user1_id: this.user.id,
            user2_id: user.id
        };

        console.log(dislikeData)
    }
}

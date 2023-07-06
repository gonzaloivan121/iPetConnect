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

    public isTest: boolean = false;

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

            this.getData();
        } else {
            this.location.back();
        }
    }

    getData() {
        this.getChats();
        this.getUsers();
        this.getMatches();
        this.getLikes();
    }

    getChats() {
        this.dataService.getFrom('chat', 'user', this.user.id).then((response: any) => {
            if (response.status === 'success') {
                this.chats = response.results as Chat[];
            }
        });
    }

    getUsers() {
        this.dataService.getExcluding('user', this.user.id).then((response: any) => {
            if (response.status === 'success') {
                this.users = response.results as User[];
            }
        });
    }

    getMatches() {
        this.dataService.getFrom('match', 'user', this.user.id).then((response: any) => {
            if (response.status === 'success') {
                this.matches = response.results as Match[];
            }
        });
    }

    getLikes() {
        this.getLikesReceived();
        this.getLikesGiven();
    }

    getLikesReceived() {
        this.dataService.getFrom('like', 'user_2', this.user.id).then((response: any) => {
            if (response.status === 'success') {
                this.likesReceived = response.results as Like[];
            }
        });
    }

    getLikesGiven() {
        this.dataService.getFrom('like', 'user_1', this.user.id).then((response: any) => {
            if (response.status === 'success') {
                this.likesGiven = response.results as Like[];
            }
        });
    }

    changeTab(tab: MatchTabEnum): void {
        this.activeTab = tab;

        if (tab == MatchTabEnum.Matches || tab == MatchTabEnum.Messages) {
            this.activeSubTab = LikesTabEnum.Received;
        }
    }

    changeSubTab(tab: LikesTabEnum): void {
        this.activeSubTab = tab;
    }

    refresh(): void {

    }

    like(user: User): void {
        const likeData = {
            user1_id: this.user.id,
            user2_id: user.id
        };

        console.log(likeData)
    }

    dislike(user: User): void {
        const dislikeData = {
            user1_id: this.user.id,
            user2_id: user.id
        };

        console.log(dislikeData)
    }

    addTestChat(): void {
        const messages: Message[] = [];
        const chat_id = this.random(1, 100);

        for (let i = 0; i < this.random(1, 5); i++) {
            messages.push(
                new Message(chat_id, this.random(0, 1) == 0 ? 45 : 12, `Message ${this.random(0,100)}`, false, false)
            );
        }

        const chat = new Chat(45, 12, messages);
        chat.id = chat_id;

        this.chats.push(chat);
    }

    removeTestChat(): void {
        this.chats.pop();
    }

    addTestMatch(): void {
        this.matches.push(new Match(45, 3));
    }

    removeTestMatch(): void {
        this.matches.pop();
    }

    random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

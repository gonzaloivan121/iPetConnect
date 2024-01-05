import { Component, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SessionService, DataService } from '../services';
import { User, Chat, Message, Match, Like } from '../../classes';
import { RoleEnum, MatchTabEnum, LikesTabEnum } from '../enums/enums';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CardComponent } from './card/card.component';

@Component({
    selector: "app-match",
    templateUrl: "./match.component.html",
    styleUrls: ["./match.component.css"],
})
export class MatchComponent implements OnInit {
    public user: User;

    public chatsLoaded: Observable<boolean>;
    public usersLoaded: Observable<boolean>;
    public matchesLoaded: Observable<boolean>;
    public likesReceivedLoaded: Observable<boolean>;
    public likesGivenLoaded: Observable<boolean>;

    public users: User[] = [];
    public chats: Chat[] = [];
    public matches: Match[] = [];
    public likesReceived: Like[] = [];
    public likesGiven: Like[] = [];

    public activeTab: MatchTabEnum = MatchTabEnum.Messages;
    public activeSubTab: LikesTabEnum = LikesTabEnum.Received;

    public isChatOpen: boolean = false;
    public currentChat: Chat;

    private dummyUser: User = new User(
        "",
        "",
        "",
        "NO_MORE_USERS",
        RoleEnum.User,
        "",
        "",
        "NO_MORE_USERS"
    );

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
    ) {}

    ngOnInit() {
        if (this.sessionService.get("user") !== null) {
            this.user = JSON.parse(this.sessionService.get("user"));

            if (this.user.role_id == RoleEnum.Admin) {
                this.location.back();
            }

            this.getData();
        } else {
            this.location.back();
        }
    }

    getData() {
        this.chatsLoaded = this.getChats();
        this.usersLoaded = this.getUsers();
        this.matchesLoaded = this.getMatches();
        this.getLikes();
    }

    getChats(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom("chat", "user", this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.chats = response.result as Chat[];
                    }
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    getUsers(): Observable<boolean> {
        return from(
            this.dataService
                .getExcluding("user", this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.users = response.result as User[];
                    }
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    getMatches(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom("match", "user", this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.matches = response.result as Match[];

                        console.log(this.matches);

                        // TODO: Quitar, testing
                        /*var ids = [
                            1, 2, 4, 5, 6, 7,
                            24, 25, 26, 27, 28,
                            29, 30, 31, 32, 33,
                            35, 36, 37, 38, 46,
                            47, 50, 51
                        ];

                        // TODO: Quitar, testing
                        for (let i = 0; i < ids.length; i++) {
                            var newMatch = new Match(ids[i], 45);
                            newMatch.id = this.matches[0].id + i;
                            newMatch.created_at = this.matches[0].created_at;
                            newMatch.updated_at = this.matches[0].updated_at;

                            this.matches.push(newMatch);
                        }*/
                    }
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    getLikes() {
        this.likesReceivedLoaded = this.getLikesReceived();
        this.likesGivenLoaded = this.getLikesGiven();
    }

    getLikesReceived(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom("like", "user_2", this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.likesReceived = response.result as Like[];
                    }
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    getLikesGiven(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom("like", "user_1", this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.likesGiven = response.result as Like[];
                    }
                })
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
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

    refresh(): void {}

    like(user: User): void {
        const data = {
            user1_id: this.user.id,
            user2_id: user.id,
        };

        this.deleteCard(user);

        console.log(data);
    }

    dislike(user: User): void {
        const data = {
            user1_id: this.user.id,
            user2_id: user.id,
        };

        this.deleteCard(user);

        console.log(data);
    }

    deleteCard(user: User) {
        setTimeout(() => {
            this.users = this.users.filter((u: User) => u.id !== user.id);
        }, 333);
    }

    addTestChat(): void {
        const messages: Message[] = [];
        const chat_id = this.random(1, 100);

        for (let i = 0; i < this.random(1, 5); i++) {
            messages.push(
                new Message(
                    chat_id,
                    this.random(0, 1) == 0 ? 45 : 12,
                    `Message ${this.random(0, 100)}`,
                    false,
                    false
                )
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

    addTestReceivedLike(): void {
        this.likesReceived.push(new Like(45, 3));
    }

    removeTestReceivedLike(): void {
        this.likesReceived.pop();
    }

    addTestGivenLike(): void {
        this.likesGiven.push(new Like(45, 3));
    }

    removeTestGivenLike(): void {
        this.likesGiven.pop();
    }

    random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    openChat(chat: Chat) {
        this.currentChat = chat;
        this.isChatOpen = true;
    }

    closeChat() {
        this.isChatOpen = false;
    }

    viewProfile(user: User) {
        console.log("viewProfile", user);
    }

    deleteChat(chat: Chat) {
        console.log("deleteChat", chat);
    }

    repotUser(user: User) {
        console.log("reportUser", user);
    }

    undoMatch(user: User) {
        console.log("undoMatch", user);
    }

    openChatByUser(user: User) {
        console.log("openChatByUser", user);

        var chatToOpen = this.chats.filter(
            (chat) => chat.user1_id == user.id || chat.user2_id == user.id
        )[0];

        if (chatToOpen !== undefined) {
            console.log(chatToOpen);
            this.openChat(chatToOpen);
        }
    }

    likeAnimDone(ev: AnimationEvent) {
        console.log(ev);
    }

    dislikeAnimDone(ev: AnimationEvent) {
        console.log(ev);
    }
}

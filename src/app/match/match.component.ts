import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SessionService, DataService } from 'src/app/services';
import { DBTables } from 'src/classes';
import { RoleEnum, MatchTabEnum, LikesTabEnum } from 'src/app/enums/enums';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IConfig, IUser, IChat, IMessage, IMatch, ILike } from 'src/app/interfaces';

@Component({
    selector: "app-match",
    templateUrl: "./match.component.html",
    styleUrls: ["./match.component.css"],
})
export class MatchComponent implements OnInit {
    public user: IUser;

    public chatsLoaded: Observable<boolean>;
    public usersLoaded: Observable<boolean>;
    public matchesLoaded: Observable<boolean>;
    public likesReceivedLoaded: Observable<boolean>;
    public likesGivenLoaded: Observable<boolean>;

    public users: IUser[] = [];
    public chats: IChat[] = [];
    public matches: IMatch[] = [];
    public likesReceived: ILike[] = [];
    public likesGiven: ILike[] = [];

    public activeTab: MatchTabEnum = MatchTabEnum.Messages;
    public activeSubTab: LikesTabEnum = LikesTabEnum.Received;

    public isChatOpen: boolean = false;
    public currentChat: IChat;

    public get matchTabEnum(): typeof MatchTabEnum {
        return MatchTabEnum;
    }

    public get likesTabEnum(): typeof LikesTabEnum {
        return LikesTabEnum;
    }

    isSidebarOpen: boolean = true;

    constructor(
        public location: Location,
        private sessionService: SessionService,
        private dataService: DataService
    ) {}

    ngOnInit() {
        if (this.sessionService.get("user") !== null) {
            this.user = JSON.parse(this.sessionService.get("user"));

            if (this.user.role_id != RoleEnum.User) {
                this.location.back();
            }

            if (this.sessionService.get("matchSidebarOpen") !== null) {
                this.isSidebarOpen = JSON.parse(
                    this.sessionService.get("matchSidebarOpen")
                );
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
                .getFrom(DBTables.Chat, DBTables.User, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.chats = response.result as IChat[];
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
                .getFrom(DBTables.User, DBTables.Match, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.filterUsersByConfig(response.result as IUser[]);
                    } else {
                        console.error(response.message);
                    }
                })
                .catch((error) => console.error(error))
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    filterUsersByConfig(users: IUser[]): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.Config, DBTables.User, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        const config = response.result[0] as IConfig;

                        this.users = users.filter((user) => {
                            var isGender: boolean = false;
                            var isAge: boolean = false;

                            if (
                                config.selected_gender == "ALL" ||
                                (config.selected_gender == "MALES" &&
                                    user.gender == "MALE") ||
                                (config.selected_gender == "FEMALES" &&
                                    user.gender == "FEMALE") ||
                                (config.selected_gender == "OTHERS" &&
                                    user.gender == "OTHER")
                            ) {
                                isGender = true;
                            }

                            var birthday: Date = new Date(user.birthday);
                            var diffInYears = this.differenceInYears(
                                birthday,
                                new Date()
                            );

                            if (
                                diffInYears >= config.min_age &&
                                diffInYears < config.max_age
                            ) {
                                isAge = true;
                            }

                            if (!config.search_in_age) {
                                isAge = true;
                            }

                            return isGender && isAge;
                        });
                    } else {
                        console.error(response.message);
                        this.users = users;
                    }
                })
                .catch((error) => console.error(error))
        ).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    differenceInYears(date1: Date, date2: Date): number {
        var diff = (date2.getTime() - date1.getTime()) / 1000;
        diff /= 60 * 60 * 24;
        return Math.abs(Math.round(diff / 365.25));
    }

    testMatches() {
        const ids = [
            1, 2, 4, 5, 6, 7, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36,
            37, 38, 46, 47, 50, 51,
        ];

        for (let i = 0; i < ids.length; i++) {
            var newMatch: IMatch = {
                id: this.matches[0].id + i,
                user1_id: ids[i],
                user2_id: 45,
                created_at: this.matches[0].created_at,
                updated_at: this.matches[0].updated_at,
            };

            this.matches.push(newMatch);
        }
    }

    getMatches(): Observable<boolean> {
        return from(
            this.dataService
                .getFrom(DBTables.Match, DBTables.User, this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.matches = response.result as IMatch[];
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
                .getFrom(DBTables.Like, "user_2", this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.likesReceived = response.result as ILike[];
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
                .getFrom(DBTables.Like, "user_1", this.user.id)
                .then((response: any) => {
                    if (response.success) {
                        this.likesGiven = response.result as ILike[];
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

    like(user: IUser): void {
        const data: ILike = {
            user1_id: this.user.id,
            user2_id: user.id,
        };

        this.deleteCard(user);
    }

    dislike(user: IUser): void {
        const data: ILike = {
            user1_id: this.user.id,
            user2_id: user.id,
        };

        this.deleteCard(user);
    }

    deleteCard(user: IUser) {
        setTimeout(() => {
            this.users = this.users.filter((u: IUser) => u.id !== user.id);
        }, 333);
    }

    addTestChat(): void {
        const messages: IMessage[] = [];
        const chat_id = this.random(1, 100);

        for (let i = 0; i < this.random(1, 5); i++) {
            const message: IMessage = {
                chat_id: chat_id,
                user_id: this.random(0, 1) == 0 ? 45 : 12,
                message: `Message ${this.random(0, 100)}`,
                edited: false,
                read: false,
            };

            messages.push(message);
        }

        const chat: IChat = {
            id: chat_id,
            user1_id: 45,
            user2_id: 12,
            messages: messages
        };

        this.chats.push(chat);
    }

    removeTestChat(): void {
        this.chats.pop();
    }

    addTestMatch(): void {
        const match: IMatch = {
            user1_id: 45,
            user2_id: 3
        };

        this.matches.push(match);
    }

    removeTestMatch(): void {
        this.matches.pop();
    }

    addTestReceivedLike(): void {
        const like: ILike = {
            user1_id: 45,
            user2_id: 3
        };
        this.likesReceived.push(like);
    }

    removeTestReceivedLike(): void {
        this.likesReceived.pop();
    }

    addTestGivenLike(): void {
        const like: ILike = {
            user1_id: 45,
            user2_id: 3,
        };
        this.likesGiven.push(like);
    }

    removeTestGivenLike(): void {
        this.likesGiven.pop();
    }

    random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    openChat(chat: IChat) {
        this.currentChat = chat;
        this.isChatOpen = true;
    }

    closeChat() {
        this.isChatOpen = false;
    }

    viewProfile(user: IUser) {
        this.users.push(user);
        if (this.isSidebarOpen) {
            this.closeChat();
            this.toggleSidebar(false);
        }
    }

    closeProfile(user: IUser) {
        setTimeout(() => {
            this.users.splice(this.users.indexOf(user), 1);
        }, 333);
    }

    deleteChat(chat: IChat) {
        console.log("deleteChat", chat);
    }

    repotUser(user: IUser) {
        console.log("reportUser", user);
    }

    undoMatch(user: IUser) {
        console.log("undoMatch", user);
    }

    openChatByUser(user: IUser) {
        console.log("openChatByUser", user);

        var chatToOpen = this.chats.filter(
            (chat) => chat.user1_id == user.id || chat.user2_id == user.id
        )[0];

        if (chatToOpen !== undefined) {
            this.openChat(chatToOpen);
        }
    }

    likeAnimDone(ev: AnimationEvent) {
        console.log("likeAnimDone", ev);
    }

    dislikeAnimDone(ev: AnimationEvent) {
        console.log("dislikeAnimDone", ev);
    }

    toggleSidebar(isOpen: boolean) {
        this.isSidebarOpen = isOpen;
        this.sessionService.set("matchSidebarOpen", JSON.stringify(isOpen));
    }
}

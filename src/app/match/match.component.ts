import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SessionService, DataService, AlertService } from 'src/app/services';
import { DBTables } from 'src/classes';
import { RoleEnum, MatchTabEnum, LikesTabEnum } from 'src/app/enums/enums';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IConfig, IUser, IChat, IMatch, ILike, IUserReport, IInsertResponse } from 'src/app/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

    @ViewChild("deleteChatContent", { static: false })
    deleteChatContent: ElementRef;

    @ViewChild("reportUserContent", { static: false })
    reportUserContent: ElementRef;

    @ViewChild("undoMatchContainer", { static: false })
    undoMatchContainer: ElementRef;

    @ViewChild("matchContainer", { static: false })
    matchContainer: ElementRef;

    @ViewChild("deleteLikeContainer", { static: false })
    deleteLikeContainer: ElementRef;

    currentUserSelectedToReport: IUser;
    currentUserSelectedToUndoMatch: IUser;
    currentUserSelected: IUser;

    currentLikeSelectedToDelete: ILike;
    currentUserToDeleteLike: IUser;

    constructor(
        public location: Location,
        private sessionService: SessionService,
        private dataService: DataService,
        private modalService: NgbModal,
        private alertService: AlertService
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

        if (
            this.likesGiven.find(
                (like) =>
                    like.user1_id === data.user1_id &&
                    like.user2_id === data.user2_id
            )
        ) {
            return;
        }

        this.dataService
            .insert(DBTables.Like, data)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    const like: ILike = {
                        id: response.result.insertId,
                        user1_id: data.user1_id,
                        user2_id: data.user2_id,
                        created_at: new Date(response.created_at),
                        updated_at: new Date(response.created_at),
                    };

                    this.likesGiven.push(like);

                    this.deleteCard(user, () => {
                        this.checkIfMatch(user);
                    });
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    checkIfMatch(user: IUser) {
        this.dataService
            .getBothFrom(DBTables.Like, DBTables.User, this.user.id, user.id)
            .then((response: any) => {
                if (response.success) {
                    if (response.result.length == 2) {
                        this.handleMatch(user, {
                            like1: response.result[0] as ILike,
                            like2: response.result[1] as ILike,
                        });
                    }
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    handleMatch(user: IUser, likes: { like1: ILike; like2: ILike }) {
        const data: IMatch = {
            user1_id: this.user.id,
            user2_id: user.id,
        };

        this.dataService
            .insert(DBTables.Match, data)
            .then((response: IInsertResponse) => {
                if (response.success) {
                    this.deleteLike(likes.like1);
                    this.deleteLike(likes.like2);

                    const match: IMatch = {
                        id: response.result.insertId,
                        user1_id: data.user1_id,
                        user2_id: data.user2_id,
                        created_at: new Date(response.created_at),
                        updated_at: new Date(response.created_at),
                    };

                    this.currentUserSelected = user;
                    this.createMatch(match);
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    deleteLike(like: ILike) {
        this.dataService
            .delete(DBTables.Like, like)
            .then((response: any) => {
                if (response.success) {
                    this.likesGiven.splice(this.likesGiven.indexOf(like), 1);
                    this.likesReceived.splice(
                        this.likesReceived.indexOf(like),
                        1
                    );
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    deleteLikeModal(likeAndUser: { like: ILike; user: IUser }) {
        this.currentLikeSelectedToDelete = likeAndUser.like;
        this.currentUserToDeleteLike = likeAndUser.user;

        this.openModal(this.deleteLikeContainer);
    }

    handleDeleteLike(closeEvent?: Function) {
        this.dataService
            .delete(DBTables.Like, this.currentLikeSelectedToDelete)
            .then((response: any) => {
                if (response.success) {
                    this.likesGiven.splice(
                        this.likesGiven.indexOf(
                            this.currentLikeSelectedToDelete
                        ),
                        1
                    );

                    this.users.push(
                        Object.assign({}, this.currentUserToDeleteLike)
                    );

                    this.currentLikeSelectedToDelete = null;
                    this.currentUserToDeleteLike = null

                    if (closeEvent) {
                        closeEvent("Like deleted");
                    }
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    createMatch(match: IMatch) {
        this.matches.push(match);
        this.openModal(this.matchContainer);
    }

    dislike(user: IUser): void {
        const data: ILike = {
            user1_id: this.user.id,
            user2_id: user.id,
        };

        this.deleteCard(user);
    }

    deleteCard(user: IUser, callback?: Function) {
        setTimeout(() => {
            this.users = this.users.filter((u: IUser) => u.id !== user.id);

            if (callback) {
                callback();
            }
        }, 333);
    }

    openChat(chat: IChat) {
        this.currentChat = chat;
        this.isChatOpen = true;
    }

    closeChat() {
        if (this.willDeleteChatOnClose()) {
            this.handleDeleteChat();
        }

        this.isChatOpen = false;
    }

    willDeleteChatOnClose(): boolean {
        return (
            this.currentChat &&
            (!this.currentChat.messages ||
                (this.currentChat.messages &&
                    this.currentChat.messages.length === 0))
        );
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
        this.openModal(this.deleteChatContent);
    }

    handleDeleteChat(closeEvent?: any) {
        this.dataService
            .delete(DBTables.Chat, this.currentChat)
            .then((response: any) => {
                if (response.success) {
                    this.chats.splice(this.chats.indexOf(this.currentChat), 1);
                    this.currentChat = null;

                    if (closeEvent) {
                        closeEvent("Chat deleted");
                        this.closeChat();
                        this.alertService.openSuccess(response.message);
                    }
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    repotUser(user: IUser) {
        this.currentUserSelectedToReport = user;
        this.openModal(this.reportUserContent);
    }

    handleReportUser(reason: string, closeEvent: any) {
        const data: IUserReport = {
            user_id: this.currentUserSelectedToReport.id,
            reason: reason,
        };

        this.dataService
            .insert(DBTables.UserReport, data)
            .then((response: any) => {
                if (response.success) {
                    this.alertService.openSuccess(response.message);
                    this.currentUserSelectedToReport = null;
                    closeEvent("User Reported");
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    undoMatch(user: IUser) {
        this.currentUserSelectedToUndoMatch = user;
        this.openModal(this.undoMatchContainer);
    }

    handleUndoMatch(closeEvent: any) {
        const match: IMatch = this.matches.filter(
            (m) =>
                (m.user1_id === this.user.id &&
                    m.user2_id === this.currentUserSelectedToUndoMatch.id) ||
                (m.user2_id === this.user.id &&
                    m.user1_id === this.currentUserSelectedToUndoMatch.id)
        )[0];

        if (!match) {
            return;
        }

        this.dataService
            .delete(DBTables.Match, match)
            .then((response: any) => {
                if (response.success) {
                    this.alertService.openSuccess(response.message);
                    this.matches.splice(this.matches.indexOf(match), 1);
                    const chat: IChat = this.chats.filter(
                        (m) =>
                            (m.user1_id === this.user.id &&
                                m.user2_id ===
                                    this.currentUserSelectedToUndoMatch.id) ||
                            (m.user2_id === this.user.id &&
                                m.user1_id ===
                                    this.currentUserSelectedToUndoMatch.id)
                    )[0];

                    this.currentUserSelectedToUndoMatch = null;

                    if (chat) {
                        this.currentChat = chat;
                        this.handleDeleteChat();
                    }

                    closeEvent("Match Undone");
                } else {
                    this.alertService.openWarning(response.message);
                }
            })
            .catch((error) => console.error(error));
    }

    openChatByUser(user: IUser) {
        var chatToOpen = this.chats.filter(
            (chat) => chat.user1_id == user.id || chat.user2_id == user.id
        )[0];

        if (chatToOpen !== undefined) {
            this.openChat(chatToOpen);
        } else {
            this.createChat(user);
        }
    }

    createChat(user: IUser) {
        const chat: IChat = {
            user1_id: this.user.id,
            user2_id: user.id,
        };

        this.dataService
            .insert(DBTables.Chat, chat)
            .then((response: any) => {
                if (response.success) {
                    chat.id = response.result.insertId;
                    chat.created_at = response.created_at;
                    chat.updated_at = response.created_at;
                    chat.messages = [];

                    this.chats.push(chat);

                    this.openChat(chat);
                } else {
                    console.warn(response.message);
                }
            })
            .catch((error) => console.error(error));
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

    openModal(content) {
        this.modalService.open(content, { centered: true });
    }
}

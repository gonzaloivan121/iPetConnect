import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { IUser, IUserFollowing } from "src/app/interfaces";
import { AlertService, DataService, UsersService } from "src/app/services";

@Component({
    selector: "app-pet-follow",
    templateUrl: "./pet-follow.component.html",
    styleUrls: ["./pet-follow.component.css"],
})
export class PetFollowComponent implements OnInit {
    public users: IUser[] = [];
    public currentUserFollowing: IUserFollowing[] = [];

    @Input() currentUser: IUser;
    @Input() profileUser: IUser;

    @Input() isFollowing: boolean = false;
    @Input() isFollowers: boolean = false;

    @Output() closeModalEvent = new EventEmitter<void>();
    @Output() followUserEvent = new EventEmitter<number>();
    @Output() unfollowUserEvent = new EventEmitter<number>();

    constructor(
        private dataService: DataService,
        private alertService: AlertService,
        private usersService: UsersService
    ) {}

    ngOnInit() {
        this.getUsers();
        this.getCurrentUserFollowing();
    }

    getUsers() {
        if (this.isFollowing) {
            this.getFollowing();
        }

        if (this.isFollowers) {
            this.getFollowers();
        }
    }

    getCurrentUserFollowing() {
        this.usersService
            .getFollowing(this.currentUser.id)
            .then((response: any) => {
                if (response.success) {
                    this.currentUserFollowing = response.result;
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getFollowing() {
        this.usersService
            .getFollowingFull(this.profileUser.id)
            .then((response: any) => {
                if (response.success) {
                    this.users = response.result;
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getFollowers() {
        this.usersService
            .getFollowersFull(this.profileUser.id)
            .then((response: any) => {
                if (response.success) {
                    this.users = response.result;
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    closeModal() {
        this.closeModalEvent.emit();
    }

    isCurrentUserFollowingThisUser(userId: number): boolean {
        var result = false;

        for (var i = 0; i < this.currentUserFollowing.length; i++) {
            const userFollowing: IUserFollowing = this.currentUserFollowing[i];

            if (userFollowing.following_user_id === userId) {
                result = true;
                break;
            }
        }

        return result;
    }

    follow(userId: number) {
        this.usersService
            .follow(this.currentUser.id, userId)
            .then((response: any) => {
                if (response.success) {
                    this.addToCurrentUserFollowing(userId);
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    unfollow(userId: number) {
        this.usersService
            .unfollow(this.currentUser.id, userId)
            .then((response: any) => {
                if (response.success) {
                    this.removeFromCurrentUserFollowing(userId);
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    addToCurrentUserFollowing(userId: number) {
        this.currentUserFollowing.push({
            follower_user_id: this.currentUser.id,
            following_user_id: userId,
        });
    }

    removeFromCurrentUserFollowing(userId: number) {
        for (var i = 0; i < this.currentUserFollowing.length; i++) {
            const userFollowing: IUserFollowing = this.currentUserFollowing[i];

            if (
                userFollowing.follower_user_id === this.currentUser.id &&
                userFollowing.following_user_id === userId
            ) {
                this.currentUserFollowing.splice(i, 1);
                break;
            }
        }
    }
}

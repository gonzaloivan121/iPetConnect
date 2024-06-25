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
        return this.dataService.getFromText(
            DBTables.User,
            "username",
            username
        );
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

    isFollowing(followerId: number, followingId: number) {
        return this.dataService.getBothFrom(
            DBTables.UserFollowing,
            "isFollowing",
            followerId,
            followingId
        );
    }

    follow(followerId: number, followingId: number) {
        const data = {
            follower_user_id: followerId,
            following_user_id: followingId,
        };

        return this.dataService.insert(DBTables.UserFollowing, data);
    }

    unfollow(followerId: number, followingId: number) {
        const data = {
            follower_user_id: followerId,
            following_user_id: followingId,
        };

        return this.dataService.deleteByData(DBTables.UserFollowing, data);
    }

    getFollowers(id: number) {
        return this.dataService.getFrom(
            DBTables.UserFollowing,
            "followers",
            id
        );
    }

    getFollowing(id: number) {
        return this.dataService.getFrom(
            DBTables.UserFollowing,
            "following",
            id
        );
    }

    getFollowedBy(id: number, currentUserId: number) {
        return this.dataService.getBothFrom(
            DBTables.UserFollowing,
            "followedBy",
            id,
            currentUserId
        );
    }

    getFollowingFull(id: number) {
        return this.dataService.getFrom(
            DBTables.UserFollowing,
            "followingFull",
            id
        );
    }

    getFollowersFull(id: number) {
        return this.dataService.getFrom(
            DBTables.UserFollowing,
            "followersFull",
            id
        );
    }
}

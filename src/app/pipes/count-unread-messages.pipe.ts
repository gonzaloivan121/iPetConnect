import { Pipe, PipeTransform } from '@angular/core';
import { IMessage } from 'src/app/interfaces';

@Pipe({
    name: "countUnreadMessages",
})
export class CountUnreadMessagesPipe implements PipeTransform {
    transform(messages: IMessage[], userId: number): number {
        return messages.filter(
            (message) => message.read == false && message.user_id == userId
        ).length;
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Message } from 'src/classes';

@Pipe({
    name: 'countUnreadMessages'
})
export class CountUnreadMessagesPipe implements PipeTransform {

    transform(messages: Message[]): number {
        return messages.filter((message) => message.read == false).length;
    }

}

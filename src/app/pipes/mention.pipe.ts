import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mention'
})
export class MentionPipe implements PipeTransform {
    private readonly regEx = /@([a-zA-Z0-9!#$%&'*+/=?^_.`{|}~-]+)/g;

    transform(text: string): string {
        if (!text) {
            return;
        }
        
        return text.replace(this.regEx, '<a href="#/pets/$1">@$1</a>');
    }
}

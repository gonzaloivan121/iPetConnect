import { Pipe, PipeTransform } from "@angular/core";
import { IChat } from "src/app/interfaces";

@Pipe({
    name: "orderByMessages",
    pure: false
})
export class OrderByMessagesPipe implements PipeTransform {
    transform(value: IChat[]): IChat[] {
        if (!value) return null;

        return value.sort((a, b) => {
            if (a.messages !== undefined && b.messages !== undefined) {
                const lastMessageFromA = new Date(a.messages[a.messages.length - 1].updated_at);
                const lastMessageFromB =  new Date(b.messages[b.messages.length - 1].updated_at);
    
                return lastMessageFromB.getTime() - lastMessageFromA.getTime();
            } else {
                return 1;
            }
        });
    }
}

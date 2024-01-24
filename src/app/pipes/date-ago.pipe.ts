import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "dateAgo",
    pure: true
})
export class DateAgoPipe implements PipeTransform {
    intervals = {
        "YEAR": 31536000,
        "MONTH": 2592000,
        "WEEK": 604800,
        "DAY": 86400,
        "HOUR": 3600,
        "MINUTE": 60,
        "SECOND": 1,
    };

    transform(value: string, args?: any): { time?: number, text: string } {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            let counter;

            for (const i in this.intervals) {
                counter = Math.floor(seconds / this.intervals[i]);

                if (counter > 0) {
                    if (counter === 1) {
                        return { time: counter, text: i };
                    } else {
                        return { time: counter, text: i + "S" };
                    }
                }
            }
        }

        return { text: value };
    }
}

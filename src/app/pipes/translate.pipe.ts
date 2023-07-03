import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from 'src/app/services';

@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {

    constructor(private translateService: TranslateService) {}

    transform(key: string): string {
        return this.translateService.data[key] || key;
    }

}

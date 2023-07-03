import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from 'src/app/services';
import { Language } from 'src/classes';

@Pipe({ name: 'languageName' })
export class LanguageNamePipe implements PipeTransform {

    constructor(
        private dataService: DataService
    ) {}

    transform(code: number): Promise<string> {
        return this.dataService.getFrom('language', 'code', code).then((response: any) => {
            if (response.status === 'success') {
                if (response.results.length > 0) {
                    const language: Language = response.results[0];
                    return language.name || code.toString();
                }
            }
        })
    }
}

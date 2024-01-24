import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from 'src/app/services';
import { DBTables } from 'src/classes';
import { ILanguage } from 'src/app/interfaces';

@Pipe({ name: 'languageName' })
export class LanguageNamePipe implements PipeTransform {

    constructor(
        private dataService: DataService
    ) {}

    transform(code: number): Promise<string> {
        return this.dataService.getFrom(DBTables.Language, 'code', code).then((response: any) => {
            if (response.success) {
                if (response.result.length > 0) {
                    const language: ILanguage = response.result[0];
                    return language.name || code.toString();
                }
            }
        })
    }
}

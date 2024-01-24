import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from 'src/app/services';
import { IBreed } from 'src/app/interfaces';
import { DBTables } from 'src/classes';

@Pipe({ name: 'breedName' })
export class BreedNamePipe implements PipeTransform {

    constructor(
        private dataService: DataService
    ) {}

    transform(id: number): Promise<string> {
        return this.dataService.get(DBTables.Breed, id).then((response: any) => {
            if (response.success) {
                if (response.result.length > 0) {
                    const breed: IBreed = response.result[0];
                    return breed.name || id.toString();
                }
            }
        })
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from 'src/app/services';
import { Breed } from 'src/classes/breed';

@Pipe({ name: 'breedName' })
export class BreedNamePipe implements PipeTransform {

    constructor(
        private dataService: DataService
    ) {}

    transform(id: number): Promise<string> {
        return this.dataService.get('breed', id).then((response: any) => {
            if (response.success) {
                if (response.result.length > 0) {
                    const breed: Breed = response.result[0];
                    return breed.name || id.toString();
                }
            }
        })
    }
}

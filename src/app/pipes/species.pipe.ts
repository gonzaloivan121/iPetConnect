import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from 'src/app/services';
import { Species } from 'src/classes/species';

@Pipe({ name: 'speciesName' })
export class SpeciesNamePipe implements PipeTransform {

    constructor(
        private dataService: DataService
    ) {}

    transform(id: number): Promise<string> {
        return this.dataService.get('species', id).then((response: any) => {
            if (response.success) {
                if (response.result.length > 0) {
                    const species: Species = response.result[0];
                    return species.name || id.toString();
                }
            }
        })
    }
}

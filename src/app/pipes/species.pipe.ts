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
            if (response.status === 'success') {
                if (response.results.length > 0) {
                    const species: Species = response.results[0];
                    return species.name || id.toString();
                }
            }
        })
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from 'src/app/services';
import { ISpecies } from 'src/app/interfaces';
import { DBTables } from 'src/classes';

@Pipe({ name: 'speciesName' })
export class SpeciesNamePipe implements PipeTransform {

    constructor(
        private dataService: DataService
    ) {}

    transform(id: number): Promise<string> {
        return this.dataService.get(DBTables.Species, id).then((response: any) => {
            if (response.success) {
                if (response.result.length > 0) {
                    const species: ISpecies = response.result[0];
                    return species.name || id.toString();
                }
            }
        })
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from 'src/app/services';
import { IRole } from 'src/app/interfaces';
import { DBTables } from 'src/classes';

@Pipe({ name: 'roleName' })
export class RoleNamePipe implements PipeTransform {

    constructor(
        private dataService: DataService
    ) {}

    transform(id: number): Promise<string> {
        return this.dataService.get(DBTables.Role, id).then((response: any) => {
            if (response.success) {
                if (response.result.length > 0) {
                    const role: IRole = response.result[0];
                    return role.name || id.toString();
                }
            }
        })
    }
}

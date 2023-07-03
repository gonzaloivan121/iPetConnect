import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from 'src/app/services';
import { Role } from 'src/classes/role';

@Pipe({ name: 'roleName' })
export class RoleNamePipe implements PipeTransform {

    constructor(
        private dataService: DataService
    ) {}

    transform(id: number): Promise<string> {
        return this.dataService.get('role', id).then((response: any) => {
            if (response.status === 'success') {
                if (response.results.length > 0) {
                    const role: Role = response.results[0];
                    return role.name || id.toString();
                }
            }
        })
    }
}

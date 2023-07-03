export class Entity {
    table: string;
    id: number;
    created_at: Date;
    updated_at: Date;

    constructor(table: string) {
        this.table = table;
    }

    static get(): Entity {
        return ;
    }

    create() {

    }

    update() {

    }

    delete() {

    }
}
import { DBTables } from './db.tables';
import { Entity } from './entity';

export class FavouriteMarker extends Entity {
    user_id: number;
    marker_id: number;

    constructor(user_id: number, marker_id: number) {
        super(DBTables.FavouriteMarker);

        this.user_id = user_id;
        this.marker_id = marker_id;
    }
}
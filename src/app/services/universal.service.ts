import {Injectable, EventEmitter} from '@angular/core';
import {UniversalModel} from '../components/models/universalmodel';

// Allow for DI
@Injectable()
export class UniversalService {
    public eventEmitter: EventEmitter<UniversalModel>;
    public universalModel: UniversalModel;

    // Instatiate all the things
    constructor() {
        this.eventEmitter = new EventEmitter();
        this.universalModel = new UniversalModel();
    }

    // Populate universalModel and emit an event to notify subscribers that there is now something here
    public set(universalModel: UniversalModel): void {
        this.universalModel = universalModel;
        this.eventEmitter.emit(this.universalModel);
    }
}
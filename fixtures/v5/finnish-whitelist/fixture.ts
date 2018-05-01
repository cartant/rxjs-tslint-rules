import { Subject } from "rxjs/Subject";
import { of } from "rxjs/observable/of";

class EventEmitter<T> extends Subject<T> {}
let eventEmitter: EventEmitter<any>;
const foreign = of(1);

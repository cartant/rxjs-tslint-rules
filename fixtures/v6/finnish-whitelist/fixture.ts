import { of, Subject } from "rxjs";

class EventEmitter<T> extends Subject<T> {}
let eventEmitter: EventEmitter<any>;
const foreign = of(1);

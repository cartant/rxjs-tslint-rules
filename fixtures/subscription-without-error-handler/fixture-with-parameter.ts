import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

const observable = Observable.of(1, 2);
const subject = new Subject<number>();
const handler = () => 0;
// Should mark it as error
observable.subscribe(handler);
// Should be ok - first parameter is not a function
observable.subscribe(subject);

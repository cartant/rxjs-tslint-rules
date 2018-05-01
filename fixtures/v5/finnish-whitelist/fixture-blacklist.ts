import { Subject } from "rxjs/Subject";
import { of } from "rxjs/observable/of";

class SomeSubject<T> extends Subject<T> {}
let someSubject: SomeSubject<any>;
const finnish = of(1);

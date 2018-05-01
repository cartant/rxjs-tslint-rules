import { of, Subject } from "rxjs";

class SomeSubject<T> extends Subject<T> {}
let someSubject: SomeSubject<any>;
const finnish = of(1);

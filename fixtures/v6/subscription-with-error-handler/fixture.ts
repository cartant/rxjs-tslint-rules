import { of, Subject } from "rxjs";

const subject = new Subject();
const observable = of([1, 2]);

observable.subscribe(function () { }, () => 0);

// When first parameter is not a function, should not trigger an error
observable.subscribe(subject);


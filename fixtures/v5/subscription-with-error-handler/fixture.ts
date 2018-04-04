import { Subject } from "rxjs/Subject";
import { of } from "rxjs/Observable/of";

const subject = new Subject();
const observable = of([1, 2]);

observable.subscribe(function () { }, () => 0);

// When first parameter is not a function, should not trigger an error
observable.subscribe(subject);


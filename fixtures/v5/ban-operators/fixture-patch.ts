import { Observable } from "rxjs/Observable";

declare const o: Observable<number>;

o.concat(Observable.of(1), Observable.of(2));
o.merge(Observable.of(1), Observable.of(2));

import { Observable } from "rxjs/Observable";

Observable.concat(Observable.of(1), Observable.of(2));
Observable.merge(Observable.of(1), Observable.of(2));

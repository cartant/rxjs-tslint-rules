import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

const observable = Observable.of([1, 2]);
observable.subscribe(value => console.log(value));

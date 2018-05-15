import { Observable } from "rxjs/Observable";
import "./fixture";

const ob1 = Observable.of(1) as Observable<number>;
const ob2 = ob1.map(value => value + 1);

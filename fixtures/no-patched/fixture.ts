import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { filter } from "rxjs/operator/filter";

const subject = new Subject<number>();
const filtered = filter.call(subject, (value) => value > 1) as Observable<number>;
const mapped = filtered.map((value) => value + 1);

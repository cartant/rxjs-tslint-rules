import { Observable } from "rxjs/Observable";
import { concat } from "rxjs/observable/concat";
import { map } from "rxjs/operator/map";

const source = concat(Observable.of(1), Observable.from([2, 3]));
const mapped = filtered.map.call(source, (value) => value + 1);

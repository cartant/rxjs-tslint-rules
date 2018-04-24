import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/mergeMap";

const ob = Observable.of(1).flatMap((value) => [value + 1]);

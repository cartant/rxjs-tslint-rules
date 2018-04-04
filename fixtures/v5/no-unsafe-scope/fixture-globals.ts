import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";

let outer: any;
Observable.of("1").map(value => parseInt(value, 10)).subscribe();
of("1").pipe(map(value => parseInt(value, 10))).subscribe();

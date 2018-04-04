import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators/map";
import { mergeMap } from "rxjs/operators/mergeMap";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";

Observable.of(1)
    .mergeMap(value => Observable.of(null)
        .map(() => value)
    ).subscribe();

of(1).pipe(
    mergeMap(value => of(null).pipe(
        map(() => value)
    ))
).subscribe();

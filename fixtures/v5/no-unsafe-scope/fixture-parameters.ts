import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";

function patched(outer: number): Observable<number> {
    return Observable.of(1).map(value => outer + value);
}

function piped(outer: number): Observable<number> {
    return of(1).pipe(map(value => outer + value));
}

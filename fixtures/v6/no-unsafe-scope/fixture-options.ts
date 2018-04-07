import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";

let outer: any;
of(1).pipe(tap(value => outer = value)).subscribe();

function piped(outer: number): Observable<number> {
    return of(1).pipe(map(value => outer + value));
}

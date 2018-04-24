import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

function piped(outer: number): Observable<number> {
    return of(1).pipe(map(value => outer + value));
}

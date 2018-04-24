import { Observable, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

of(1).pipe(
    mergeMap(value => of(null).pipe(
        map(() => value)
    ))
).subscribe();

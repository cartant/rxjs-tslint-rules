import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

let outer: any;
of(1).pipe(tap(value => outer = value)).subscribe();

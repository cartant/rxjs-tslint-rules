import { of } from "rxjs";
import { tap } from "rxjs/operators";
import { tap as tapAlias } from "rxjs/operators";

const ob = of(1).pipe(
    tap(value => console.log(value)),
    tapAlias(value => console.log(value))
);

import { of } from "rxjs/observable/of";
import { tap } from "rxjs/operators/tap";
import { tap as tapAlias } from "rxjs/operators/tap";

const ob = of(1).pipe(
    tap(value => console.log(value)),
    tapAlias(value => console.log(value))
);

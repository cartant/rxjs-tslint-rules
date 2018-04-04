import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Vertical } from "./enums";

enum Horizontal {
    Left = 1,
    Right
}

of(1).pipe(
    map(() => Horizontal.Left),
    map(() => Vertical.Up)
).subscribe();

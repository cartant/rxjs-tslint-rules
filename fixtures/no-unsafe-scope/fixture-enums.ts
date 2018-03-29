import { Observable } from "rxjs";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators/map";
import { Vertical } from "./enums";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";

enum Horizontal {
    Left = 1,
    Right
}

Observable.of(1)
    .map(() => Horizontal.Left)
    .map(() => Vertical.Up).subscribe();
of(1).pipe(
    map(() => Horizontal.Left),
    map(() => Vertical.Up)
).subscribe();

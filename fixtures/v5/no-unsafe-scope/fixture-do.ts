import { Observable } from "rxjs";
import { of } from "rxjs/observable/of";
import { tap } from "rxjs/operators/tap";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";

let outer: any;
Observable.of(1).do(value => outer = value).subscribe();
of(1).pipe(tap(value => outer = value)).subscribe();

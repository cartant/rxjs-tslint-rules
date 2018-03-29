import { Observable } from "rxjs";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators/map";
import { THOUSAND } from "./constants";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";

const HUNDRED = 100;

Observable.of(1).map(value => value * HUNDRED * THOUSAND).subscribe();
of(1).pipe(map(value => value * HUNDRED * THOUSAND)).subscribe();

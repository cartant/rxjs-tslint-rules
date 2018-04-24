import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { THOUSAND } from "./constants";

const HUNDRED = 100;

of(1).pipe(map(value => value * HUNDRED * THOUSAND)).subscribe();

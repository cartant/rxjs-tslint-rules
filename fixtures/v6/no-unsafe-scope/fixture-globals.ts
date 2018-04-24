import { Observable, of} from "rxjs";
import { map } from "rxjs/operators";

let outer: any;
of("1").pipe(map(value => parseInt(value, 10))).subscribe();

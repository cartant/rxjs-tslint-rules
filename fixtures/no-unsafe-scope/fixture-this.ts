import { Observable } from "rxjs";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";

class User {
    constructor(private name: string) {
        Observable.of("Hello").map(value => `${value}, ${this.name}.`).subscribe();
        of("Hello").pipe(map(value => `${value}, ${this.name}.`)).subscribe();
    }
}

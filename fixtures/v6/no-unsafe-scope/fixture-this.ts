import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

class User {
    constructor(private name: string) {
        of("Hello").pipe(map(value => `${value}, ${this.name}.`)).subscribe();
    }
}

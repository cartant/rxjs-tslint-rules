import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

export function custom<T>(this: Observable<T>): Observable<T> {
    return this;
}

Observable.prototype.custom = custom;

declare module "rxjs/internal/Observable" {
    interface Observable<T> {
        custom: typeof custom;
    }
}

const ob = Observable.of(1).custom();

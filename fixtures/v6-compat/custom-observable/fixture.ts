import { Observable } from "rxjs/Observable";

export function staticCustom<T>(): Observable<T> {
    return null;
}

Observable.custom = staticCustom;

declare module "rxjs/internal/Observable" {
    namespace Observable {
        export let custom: typeof staticCustom;
    }
}

const ob = Observable.custom();

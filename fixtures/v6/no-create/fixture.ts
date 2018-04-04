import { Observable, Observer } from "rxjs";

const ob = Observable.create((observer: Observer<string>) => {
    observer.next("Hello, world.");
    observer.complete();
    return () => {};
});

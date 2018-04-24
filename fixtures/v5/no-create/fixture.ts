import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

const ob = Observable.create((observer: Observer<string>) => {
    observer.next("Hello, world.");
    observer.complete();
    return () => {};
});

import { Observable } from "rxjs";

const ob = Observable.create<string>((observer) => {
    observer.next("Hello, world.");
    observer.complete();
    return () => {};
});

import { Observable } from "rxjs";
import "rxjs/add/observable/of";

const someObservable = Observable.of(0);

const someObject = { someKey: someObservable };
const { someKey } = someObject;
const { someKey: someRenamedKey } = someObject;

const someArray: Observable<any>[] = [someConst];
const [someElement] = someArray;
someArray.forEach(function (element: Observable<any>): void {});
someArray.forEach((element: Observable<any>) => {});

function someFunction(someParam: Observable<any>): Observable<any> { return someParam; }

class SomeClass {
    someProperty: Observable<any>;
    constructor (someParam: Observable<any>) {}
    get someGetter(): Observable<any> { throw new Error("Some error."); }
    set someSetter(someParam: Observable<any>) {}
    someMethod(someParam: Observable<any>): Observable<any> { return someParam; }
}

interface SomeInterface {
    someProperty: Observable<any>;
    someMethod(someParam: Observable<any>): Observable<any>;
}
